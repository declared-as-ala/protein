'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder, getStorageUrl, getOrderDetails } from '@/services/api';
import type { OrderRequest, Order } from '@/types';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ArrowLeft, ShoppingCart, Shield, Truck, CheckCircle2, Loader2, CreditCard, Wallet, Printer, List, ArrowRight, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AddressSelector } from '@/app/components/AddressSelector';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import Link from 'next/link';

const FREE_SHIPPING_THRESHOLD = 300;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [orderData, setOrderData] = useState<{ order: Order; orderDetails: any[] } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Address selector states
  const [gouvernorat, setGouvernorat] = useState('');
  const [delegation, setDelegation] = useState('');
  const [localite, setLocalite] = useState('');
  const [codePostal, setCodePostal] = useState('');
  
  // Shipping address selector states
  const [livraisonGouvernorat, setLivraisonGouvernorat] = useState('');
  const [livraisonDelegation, setLivraisonDelegation] = useState('');
  const [livraisonLocalite, setLivraisonLocalite] = useState('');
  const [livraisonCodePostal, setLivraisonCodePostal] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    // Billing
    nom: user?.name?.split(' ')[0] || '',
    prenom: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    phone2: '',
    pays: 'Tunisie',
    region: '',
    ville: '',
    code_postale: codePostal,
    adresse1: '',
    adresse2: '',
    // Shipping
    livraison_nom: '',
    livraison_prenom: '',
    livraison_email: '',
    livraison_phone: '',
    livraison_region: '',
    livraison_ville: '',
    livraison_code_postale: livraisonCodePostal,
    livraison_adresse1: '',
    livraison_adresse2: '',
    // Other
    note: '',
    livraison: 1, // 1 = livraison activée, 0 = pas de livraison
  });

  useEffect(() => {
    // Don't redirect if order is being completed or already completed, or if we're on step 3
    if (isOrderComplete || isSubmitting || currentStep === 3) {
      return;
    }
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [items, router, isOrderComplete, isSubmitting, currentStep]);

  // Sync shipping address when sameAsBilling checkbox changes
  useEffect(() => {
    if (sameAsBilling) {
      setFormData(prev => ({
        ...prev,
        livraison_nom: prev.nom,
        livraison_prenom: prev.prenom,
        livraison_email: prev.email,
        livraison_phone: prev.phone,
        livraison_region: prev.region,
        livraison_ville: prev.ville,
        livraison_code_postale: prev.code_postale,
        livraison_adresse1: prev.adresse1,
        livraison_adresse2: prev.adresse2,
      }));
      // Sync address selector states
      setLivraisonGouvernorat(gouvernorat);
      setLivraisonDelegation(delegation);
      setLivraisonLocalite(localite);
      setLivraisonCodePostal(codePostal);
    }
  }, [sameAsBilling, gouvernorat, delegation, localite, codePostal]);
  
  // Update formData when address selector values change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      region: gouvernorat,
      ville: localite || delegation, // Use localite if available, otherwise delegation
      code_postale: codePostal,
    }));
  }, [gouvernorat, delegation, localite, codePostal]);
  
  useEffect(() => {
    if (!sameAsBilling) {
      setFormData(prev => ({
        ...prev,
        livraison_region: livraisonGouvernorat,
        livraison_ville: livraisonLocalite || livraisonDelegation,
        livraison_code_postale: livraisonCodePostal,
      }));
    }
  }, [livraisonGouvernorat, livraisonDelegation, livraisonLocalite, livraisonCodePostal, sameAsBilling]);

  // Memoize price calculations to avoid recalculating on every render
  const totalPrice = useMemo(() => getTotalPrice(), [items, getTotalPrice]);
  const shippingCost = useMemo(() => 
    totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 10, 
    [totalPrice]
  );
  const finalTotal = useMemo(() => totalPrice + shippingCost, [totalPrice, shippingCost]);

  // Memoized handler to prevent unnecessary re-renders
  // Using a stable reference to avoid recreating the function on every render
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      // Create new object only if value actually changed
      if (prev[field as keyof typeof prev] === value) {
        return prev;
      }
      
      const updated = { ...prev, [field]: value };
      
      // If sameAsBilling is true and we're updating a billing field, sync shipping fields
      if (sameAsBilling) {
        const billingToShippingMap: Record<string, string> = {
          nom: 'livraison_nom',
          prenom: 'livraison_prenom',
          email: 'livraison_email',
          phone: 'livraison_phone',
          region: 'livraison_region',
          ville: 'livraison_ville',
          code_postale: 'livraison_code_postale',
          adresse1: 'livraison_adresse1',
          adresse2: 'livraison_adresse2',
        };
        
        const shippingField = billingToShippingMap[field];
        if (shippingField) {
          (updated as any)[shippingField] = value;
        }
      }
      
      return updated;
    });
  }, [sameAsBilling]);

  // Memoize address selector handlers to prevent re-renders
  const handleGouvernoratChange = useCallback((value: string) => {
    setGouvernorat(value);
    setDelegation('');
    setLocalite('');
    setCodePostal('');
  }, []);

  const handleDelegationChange = useCallback((value: string) => {
    setDelegation(value);
    setLocalite('');
    setCodePostal('');
  }, []);

  const handleLocaliteChange = useCallback((value: string, postalCode: string) => {
    setLocalite(value);
    setCodePostal(postalCode);
    setFormData(prev => ({
      ...prev,
      code_postale: postalCode,
      ville: value || delegation,
    }));
  }, [delegation]);

  const handleLivraisonGouvernoratChange = useCallback((value: string) => {
    setLivraisonGouvernorat(value);
    setLivraisonDelegation('');
    setLivraisonLocalite('');
    setLivraisonCodePostal('');
  }, []);

  const handleLivraisonDelegationChange = useCallback((value: string) => {
    setLivraisonDelegation(value);
    setLivraisonLocalite('');
    setLivraisonCodePostal('');
  }, []);

  const handleLivraisonLocaliteChange = useCallback((value: string, postalCode: string) => {
    setLivraisonLocalite(value);
    setLivraisonCodePostal(postalCode);
    setFormData(prev => ({
      ...prev,
      livraison_code_postale: postalCode,
      livraison_ville: value || livraisonDelegation,
    }));
  }, [livraisonDelegation]);

  const validateForm = () => {
    const required = ['nom', 'prenom', 'email', 'phone', 'adresse1'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Le champ ${field} est requis`);
        return false;
      }
    }
    
    // Validate address selector fields
    if (!gouvernorat || !delegation || !localite) {
      toast.error('Veuillez sélectionner le gouvernorat, la délégation et la localité');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      toast.error('Email invalide');
      return false;
    }
    
    // Validate phone format (Tunisian phone numbers - 8 digits)
    const phoneDigits = formData.phone.replace(/\s/g, '');
    if (phoneDigits.length < 8) {
      toast.error('Numéro de téléphone invalide (minimum 8 chiffres)');
      return false;
    }
    
    // Validate shipping address if different
    if (!sameAsBilling) {
      if (!livraisonGouvernorat || !livraisonDelegation || !livraisonLocalite) {
        toast.error('Veuillez compléter l\'adresse de livraison');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data with proper type conversions
      // code_postale must be an integer (or null), livraison_code_postale can be string
      const orderData: OrderRequest = {
        commande: {
          ...formData,
          // Convert code_postale to number or null (backend expects integer)
          code_postale: formData.code_postale 
            ? (isNaN(Number(formData.code_postale)) ? null : Number(formData.code_postale))
            : null,
          // livraison_code_postale as string or null
          livraison_code_postale: formData.livraison_code_postale || null,
          frais_livraison: shippingCost,
          user_id: user?.id,
        },
        panier: items.map(item => ({
          produit_id: item.product.id,
          quantite: item.quantity,
          prix_unitaire: (item.product as any).prix || (item.product as any).price || 0,
        })),
      };

      const response = await createOrder(orderData);
      
      // Get order ID from response (could be response.id or response.commande.id)
      const orderId = response.id || (response as any).commande?.id || (response as any).data?.id;
      
      if (!orderId) {
        console.error('Order ID not found in response:', response);
        throw new Error('Erreur: ID de commande introuvable dans la réponse');
      }
      
      // Set flag to prevent cart redirect BEFORE clearing cart
      setIsOrderComplete(true);
      
      // Move to step 3 (confirmation) BEFORE clearing cart and fetching details
      // This ensures the component doesn't return null due to empty cart
      setCurrentStep(3);
      
      // Fetch order details for confirmation step
      try {
        const orderDetailsData = await getOrderDetails(Number(orderId));
        setOrderData({
          order: orderDetailsData.facture,
          orderDetails: orderDetailsData.details_facture || []
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Erreur lors du chargement des détails de la commande');
        // Create a minimal order object from the response if fetch fails
        setOrderData({
          order: {
            id: Number(orderId),
            numero: (response as any).numero || `#${orderId}`,
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            phone: formData.phone,
            pays: formData.pays,
            region: formData.region,
            ville: formData.ville,
            code_postale: formData.code_postale?.toString(),
            adresse1: formData.adresse1,
            adresse2: formData.adresse2,
            livraison: formData.livraison,
            frais_livraison: shippingCost,
            prix_ht: totalPrice,
            prix_ttc: finalTotal,
            etat: 'nouvelle_commande',
            user_id: user?.id,
            created_at: new Date().toISOString(),
          } as Order,
          orderDetails: items.map(item => ({
            id: 0,
            produit_id: item.product.id,
            qte: item.quantity,
            prix_unitaire: (item.product as any).prix || (item.product as any).price || 0,
            prix_ht: ((item.product as any).prix || (item.product as any).price || 0) * item.quantity,
            prix_ttc: ((item.product as any).prix || (item.product as any).price || 0) * item.quantity,
            produit: {
              id: item.product.id,
              designation_fr: (item.product as any).designation_fr || (item.product as any).name || 'Produit',
              cover: (item.product as any).cover,
              slug: (item.product as any).slug,
            }
          }))
        });
      }
      
      toast.success('Commande passée avec succès !');
      
      // Clear cart AFTER setting step 3 and order data
      clearCart();
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    if (!printRef.current || !orderData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Veuillez autoriser les pop-ups pour imprimer');
      return;
    }

    const logoUrl = 'https://admin.protein.tn/storage/coordonnees/September2023/OXC3oL0LreP3RCsgR3k6.webp';
    const order = orderData.order;
    const details = orderData.orderDetails;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Commande #${order?.numero || ''}</title>
          <style>
            @media print {
              @page { margin: 20mm; size: A4; }
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; color: #000; background: #fff; }
            }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; color: #1f2937; background: #fff; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #dc2626; }
            .logo { height: 60px; width: auto; }
            .order-number { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 5px; }
            .confirmation-message { text-align: center; margin: 30px 0; padding: 20px; background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f9fafb; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .summary-total { font-weight: bold; font-size: 18px; border-top: 2px solid #e5e7eb; padding-top: 10px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" alt="Logo" class="logo" />
            <div>
              <div class="order-number">Commande #${order?.numero || ''}</div>
              <div>Date: ${formatDate(order?.created_at || null)}</div>
            </div>
          </div>
          <div class="confirmation-message">
            <h1>✓ Commande confirmée</h1>
            <p>Merci pour votre commande !</p>
          </div>
          <div class="section">
            <div class="section-title">Détails de la commande</div>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${details.map((detail: any) => `
                  <tr>
                    <td>${detail.produit?.designation_fr || 'Produit'}</td>
                    <td>${detail.qte || 0}</td>
                    <td>${(detail.prix_unitaire || 0).toFixed(2)} TND</td>
                    <td>${(detail.prix_ttc || 0).toFixed(2)} TND</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="margin-top: 20px;">
              <div class="summary-row">
                <span>Sous-total:</span>
                <span>${(order?.prix_ht || 0).toFixed(2)} TND</span>
              </div>
              ${order?.frais_livraison ? `
                <div class="summary-row">
                  <span>Expédition:</span>
                  <span>${order.frais_livraison} TND</span>
                </div>
              ` : `
                <div class="summary-row">
                  <span>Expédition:</span>
                  <span style="color: #16a34a;">Livraison gratuite</span>
                </div>
              `}
              <div class="summary-row summary-total">
                <span>Total:</span>
                <span>${(order?.prix_ttc || 0).toFixed(2)} TND</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Step 3: Confirmation - Show this even if cart is empty (order already placed)
  if (currentStep === 3 && orderData) {
    const order = orderData.order;
    const details = orderData.orderDetails;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Panier</span>
              </div>
              <div className="flex-1 h-0.5 bg-red-600 mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Livraison et Paiement</span>
              </div>
              <div className="flex-1 h-0.5 bg-red-600 mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-sm font-medium text-gray-900 dark:text-white font-semibold">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Confirmation Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Success Message */}
            <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Commande confirmée !
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Merci pour votre commande #{order?.numero || ''}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Un email de confirmation a été envoyé à {order?.email || user?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="lg"
                className="min-h-[48px]"
              >
                <Printer className="h-5 w-5 mr-2" />
                Imprimer
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white min-h-[48px]"
              >
                <Link href="/account/orders">
                  <List className="h-5 w-5 mr-2" />
                  Voir toutes mes commandes
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-[48px]"
              >
                <Link href="/shop">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Continuer les achats
                </Link>
              </Button>
            </div>

            {/* Order Recap */}
            <div ref={printRef}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Récapitulatif de la commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de commande</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">#{order?.numero || ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date de commande</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(order?.created_at || null)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Produits commandés</h3>
                    <div className="space-y-4">
                      {details.map((detail: any) => {
                        const productImage = detail.produit?.cover 
                          ? getStorageUrl(detail.produit.cover) 
                          : null;
                        return (
                          <div key={detail.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {productImage && (
                              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                                <Image
                                  src={productImage}
                                  alt={detail.produit?.designation_fr || 'Produit'}
                                  fill
                                  className="object-contain p-1"
                                  sizes="80px"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {detail.produit?.designation_fr || 'Produit'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quantité: {detail.qte || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {(detail.prix_ttc || 0).toFixed(2)} TND
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {(detail.prix_unitaire || 0).toFixed(2)} TND / unité
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span className="font-semibold">{(order?.prix_ht || 0).toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expédition</span>
                      <span className={order?.frais_livraison ? 'font-semibold' : 'text-green-600 dark:text-green-400 font-semibold'}>
                        {order?.frais_livraison ? `${order.frais_livraison} TND` : 'Livraison gratuite'}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-red-600 dark:text-red-400">
                        {(order?.prix_ttc || 0).toFixed(2)} TND
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Méthode de paiement</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {paymentMethod === 'cod' ? 'Paiement à la livraison' : 'Carte Bancaire'}
                    </p>
                  </div>

                  {/* Billing Address */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Adresse de facturation</h3>
                    <div className="text-gray-600 dark:text-gray-400">
                      <p>{order?.nom || ''} {order?.prenom || ''}</p>
                      <p>{order?.adresse1 || ''}</p>
                      {order?.adresse2 && <p>{order.adresse2}</p>}
                      <p>{order?.ville || ''}, {order?.region || ''}</p>
                      <p>{order?.code_postale || ''}</p>
                      <p className="mt-2">
                        <strong>Téléphone:</strong> {order?.phone || ''}
                      </p>
                      <p>
                        <strong>Email:</strong> {order?.email || ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(2)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'étape précédente
              </Button>
            </div>
          </motion.div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  // Don't show checkout form if cart is empty (unless we're on step 3, which is handled above)
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 1 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}>Panier</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${
              currentStep >= 2 ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 2 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}>Livraison et Paiement</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${
              currentStep >= 3 ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep >= 3 ? 'bg-red-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 3 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}>Confirmation</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => currentStep === 2 ? router.push('/cart') : setCurrentStep(2)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 2 ? 'Retour au panier' : 'Retour'}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-800">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Informations de facturation</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Remplissez vos informations pour finaliser votre commande
                  </p>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Informations personnelles</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="nom" className="text-sm font-semibold text-gray-900 dark:text-white">
                            Nom <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => handleInputChange('nom', e.target.value)}
                            className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                            placeholder="Votre nom"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prenom" className="text-sm font-semibold text-gray-900 dark:text-white">
                            Prénom <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="prenom"
                            value={formData.prenom}
                            onChange={(e) => handleInputChange('prenom', e.target.value)}
                            className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                            placeholder="Votre prénom"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-white">
                            Email <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            autoComplete="email"
                            className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                            placeholder="votre@email.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-900 dark:text-white">
                            Téléphone <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                            placeholder="+216 XX XXX XXX"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone2" className="text-sm font-semibold text-gray-900 dark:text-white">
                          Téléphone 2 <span className="text-gray-400 text-xs">(optionnel)</span>
                        </Label>
                        <Input
                          id="phone2"
                          type="tel"
                          value={formData.phone2}
                          onChange={(e) => handleInputChange('phone2', e.target.value)}
                          className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                          placeholder="+216 XX XXX XXX"
                        />
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2 pb-2">
                        <Truck className="h-5 w-5 text-red-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adresse de facturation</h3>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pays" className="text-sm font-semibold text-gray-900 dark:text-white">
                          Pays
                        </Label>
                        <Input
                          id="pays"
                          value={formData.pays}
                          onChange={(e) => handleInputChange('pays', e.target.value)}
                          readOnly
                          className="h-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed"
                        />
                      </div>

                    {/* Address Selector */}
                    <AddressSelector
                      gouvernorat={gouvernorat}
                      delegation={delegation}
                      localite={localite}
                      codePostal={codePostal}
                      onGouvernoratChange={handleGouvernoratChange}
                      onDelegationChange={handleDelegationChange}
                      onLocaliteChange={handleLocaliteChange}
                      required
                    />

                      <div className="space-y-2">
                        <Label htmlFor="adresse1" className="text-sm font-semibold text-gray-900 dark:text-white">
                          Adresse ligne 1 <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="adresse1"
                          value={formData.adresse1}
                          onChange={(e) => handleInputChange('adresse1', e.target.value)}
                          className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                          placeholder="Rue, numéro, bâtiment..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adresse2" className="text-sm font-semibold text-gray-900 dark:text-white">
                          Adresse ligne 2 <span className="text-gray-400 text-xs">(optionnel)</span>
                        </Label>
                        <Input
                          id="adresse2"
                          value={formData.adresse2}
                          onChange={(e) => handleInputChange('adresse2', e.target.value)}
                          className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                          placeholder="Appartement, étage, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="note" className="text-sm font-semibold text-gray-900 dark:text-white">
                          Notes de commande <span className="text-gray-400 text-xs">(optionnel)</span>
                        </Label>
                        <textarea
                          id="note"
                          value={formData.note}
                          onChange={(e) => handleInputChange('note', e.target.value)}
                          className="w-full min-h-[120px] p-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
                          placeholder="Commentaires concernant votre commande, ex. : consignes de livraison, instructions spéciales..."
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-6">
                        <CreditCard className="h-5 w-5 text-red-600" />
                        <Label className="text-lg font-bold text-gray-900 dark:text-white">Méthode de paiement</Label>
                      </div>
                      <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cod' | 'card')}>
                        <div className="space-y-3">
                          {/* Cash on Delivery */}
                          <label
                            htmlFor="cod"
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              paymentMethod === 'cod'
                                ? 'border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <RadioGroupItem value="cod" id="cod" className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${
                                  paymentMethod === 'cod'
                                    ? 'bg-orange-100 dark:bg-orange-900/30'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <Wallet className={`h-5 w-5 ${
                                    paymentMethod === 'cod'
                                      ? 'text-orange-600 dark:text-orange-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-gray-900 dark:text-white block">
                                    Paiement à la livraison
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Espèces ou chèque
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
                                Payez directement au livreur lors de la réception de votre commande.
                              </p>
                            </div>
                          </label>

                          {/* Card Payment */}
                          <label
                            htmlFor="card"
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              paymentMethod === 'card'
                                ? 'border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <RadioGroupItem value="card" id="card" className="mt-1" />
                            <div className="flex-1 w-full">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${
                                  paymentMethod === 'card'
                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <CreditCard className={`h-5 w-5 ${
                                    paymentMethod === 'card'
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-gray-900 dark:text-white block">
                                    Carte Bancaire
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Paiement sécurisé en ligne
                                  </span>
                                </div>
                              </div>
                              
                              {/* Payment Cards Logos */}
                              <div className="ml-11 mb-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-3 flex items-center justify-center gap-3">
                                <Image
                                  src="/payment card.png"
                                  alt="Méthodes de paiement acceptées"
                                  width={280}
                                  height={60}
                                  className="h-10 w-auto object-contain"
                                  style={{ width: 'auto', height: '40px' }}
                                  priority={false}
                                />
                              </div>

                              {/* Conditional Free Shipping Message */}
                              {shippingCost > 0 && totalPrice < FREE_SHIPPING_THRESHOLD && (
                                <div className="ml-11 flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                                  <Truck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-green-800 dark:text-green-200">
                                      Livraison gratuite disponible
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                      Ajoutez {(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(0)} DT pour bénéficier de la livraison gratuite
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {shippingCost === 0 && (
                                <div className="ml-11 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                  <Truck className="h-4 w-4" />
                                  <span className="font-medium">Livraison gratuite incluse</span>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 h-5 w-5 rounded border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer text-gray-700 dark:text-gray-300 leading-relaxed">
                        J'ai lu et j'accepte les{' '}
                        <a href="/terms" className="text-red-600 dark:text-red-400 hover:underline font-semibold">
                          conditions générales de vente
                        </a>
                        {' '}et la{' '}
                        <a href="/privacy" className="text-red-600 dark:text-red-400 hover:underline font-semibold">
                          politique de confidentialité
                        </a>
                      </Label>
                    </div>

                    {/* Shipping Address */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-6">
                        <Truck className="h-5 w-5 text-red-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adresse de livraison</h3>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-900/50 mb-6">
                        <Checkbox
                          id="sameAsBilling"
                          checked={sameAsBilling}
                          onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                          className="mt-1"
                        />
                        <Label htmlFor="sameAsBilling" className="font-semibold text-gray-900 dark:text-white cursor-pointer flex-1">
                          Utiliser la même adresse pour la livraison
                        </Label>
                      </div>

                      {!sameAsBilling && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-5 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="livraison_nom" className="text-sm font-semibold text-gray-900 dark:text-white">
                                Nom <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                id="livraison_nom"
                                value={formData.livraison_nom}
                                onChange={(e) => handleInputChange('livraison_nom', e.target.value)}
                                className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                                placeholder="Nom du destinataire"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="livraison_prenom" className="text-sm font-semibold text-gray-900 dark:text-white">
                                Prénom <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                id="livraison_prenom"
                                value={formData.livraison_prenom}
                                onChange={(e) => handleInputChange('livraison_prenom', e.target.value)}
                                className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                                placeholder="Prénom du destinataire"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="livraison_email" className="text-sm font-semibold text-gray-900 dark:text-white">
                                Email <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                id="livraison_email"
                                type="email"
                                value={formData.livraison_email}
                                onChange={(e) => handleInputChange('livraison_email', e.target.value)}
                                autoComplete="email"
                                className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                                placeholder="email@example.com"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="livraison_phone" className="text-sm font-semibold text-gray-900 dark:text-white">
                                Téléphone <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                id="livraison_phone"
                                type="tel"
                                value={formData.livraison_phone}
                                onChange={(e) => handleInputChange('livraison_phone', e.target.value)}
                                className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                                placeholder="+216 XX XXX XXX"
                                required
                              />
                            </div>
                          </div>

                          {/* Shipping Address Selector */}
                          <AddressSelector
                            gouvernorat={livraisonGouvernorat}
                            delegation={livraisonDelegation}
                            localite={livraisonLocalite}
                            codePostal={livraisonCodePostal}
                            onGouvernoratChange={handleLivraisonGouvernoratChange}
                            onDelegationChange={handleLivraisonDelegationChange}
                            onLocaliteChange={handleLivraisonLocaliteChange}
                            label="Adresse de livraison"
                          />

                          <div className="space-y-2">
                            <Label htmlFor="livraison_adresse1" className="text-sm font-semibold text-gray-900 dark:text-white">
                              Adresse ligne 1 <span className="text-red-600">*</span>
                            </Label>
                            <Input
                              id="livraison_adresse1"
                              value={formData.livraison_adresse1}
                              onChange={(e) => handleInputChange('livraison_adresse1', e.target.value)}
                              className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                              placeholder="Rue, numéro, bâtiment..."
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="livraison_adresse2" className="text-sm font-semibold text-gray-900 dark:text-white">
                              Adresse ligne 2 <span className="text-gray-400 text-xs">(optionnel)</span>
                            </Label>
                            <Input
                              id="livraison_adresse2"
                              value={formData.livraison_adresse2}
                              onChange={(e) => handleInputChange('livraison_adresse2', e.target.value)}
                              className="h-12 border-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
                              placeholder="Appartement, étage, etc."
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-16 text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Traitement de votre commande...
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 mr-2" />
                          Confirmer et payer
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-4"
            >
              <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-800">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-b border-gray-200 dark:border-gray-800">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-red-600 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <span>Récapitulatif</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {items.length} {items.length === 1 ? 'article' : 'articles'}
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Items */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                    {items.map((item) => {
                      const price = (item.product as any).prix || (item.product as any).price || 0;
                      const productName = (item.product as any).designation_fr || (item.product as any).name;
                      const productImage = (item.product as any).cover 
                        ? getStorageUrl((item.product as any).cover) 
                        : null;
                      return (
                        <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                          {productImage && (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                              <Image
                                src={productImage}
                                alt={productName}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                              {productName}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Qté: {item.quantity}
                              </p>
                              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                {(price * item.quantity).toFixed(0)} DT
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{totalPrice.toFixed(0)} DT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Expédition</span>
                      <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {shippingCost === 0 ? (
                          <span className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            Gratuite
                          </span>
                        ) : (
                          `${shippingCost} DT`
                        )}
                      </span>
                    </div>
                    {totalPrice < FREE_SHIPPING_THRESHOLD && shippingCost > 0 && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                        <p className="text-xs font-medium text-green-800 dark:text-green-200">
                          💡 Ajoutez {(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(0)} DT pour la livraison gratuite !
                        </p>
                      </div>
                    )}
                    <div className="border-t border-gray-300 dark:border-gray-700 pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {finalTotal.toFixed(0)} DT
                      </span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Paiement sécurisé</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Vos données sont protégées</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Livraison rapide</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">3-4 jours ouvrés</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Garantie qualité</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Produits certifiés</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
