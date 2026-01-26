'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder, getStorageUrl } from '@/services/api';
import type { OrderRequest } from '@/types';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ArrowLeft, ShoppingCart, Shield, Truck, CheckCircle2, Loader2, CreditCard, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AddressSelector } from '@/app/components/AddressSelector';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';

const FREE_SHIPPING_THRESHOLD = 300;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  
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
    // Don't redirect if order is being completed or already completed
    if (isOrderComplete || isSubmitting) {
      return;
    }
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [items, router, isOrderComplete, isSubmitting]);

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
      
      toast.success('Commande passée avec succès !');
      
      // Clear cart immediately but flag prevents redirect
      clearCart();
      
      // Use replace to avoid back button issues and force navigation
      router.replace(`/order-confirmation/${orderId}`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Panier</span>
            </div>
            <div className="flex-1 h-0.5 bg-red-600 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white font-semibold">Livraison et Paiement</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-700 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmation</span>
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
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au panier
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Informations de facturation</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => handleInputChange('prenom', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          autoComplete="email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone 1 *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone2">Téléphone 2 (facultatif)</Label>
                      <Input
                        id="phone2"
                        type="tel"
                        value={formData.phone2}
                        onChange={(e) => handleInputChange('phone2', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pays">Pays/région</Label>
                      <Input
                        id="pays"
                        value={formData.pays}
                        onChange={(e) => handleInputChange('pays', e.target.value)}
                        readOnly
                        className="bg-gray-50 dark:bg-gray-800"
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

                    <div>
                      <Label htmlFor="adresse1">Adresse ligne 1 *</Label>
                      <Input
                        id="adresse1"
                        value={formData.adresse1}
                        onChange={(e) => handleInputChange('adresse1', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="adresse2">Adresse ligne 2</Label>
                      <Input
                        id="adresse2"
                        value={formData.adresse2}
                        onChange={(e) => handleInputChange('adresse2', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="note">Notes de commande (facultatif)</Label>
                      <textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => handleInputChange('note', e.target.value)}
                        className="w-full min-h-[100px] p-3 border border-gray-300 dark:border-gray-700 rounded-lg mt-1"
                        placeholder="Commentaires concernant votre commande, ex. : consignes de livraison."
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="pt-6 border-t">
                      <Label className="text-base font-semibold mb-4 block">Méthode de paiement</Label>
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
                    <div className="flex items-start space-x-2 pt-4">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        J'ai lu et j'accepte les{' '}
                        <a href="/terms" className="text-red-600 hover:underline">
                          conditions générales
                        </a>
                      </Label>
                    </div>

                    {/* Shipping Address */}
                    <div className="pt-6 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="sameAsBilling"
                          checked={sameAsBilling}
                          onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                        />
                        <Label htmlFor="sameAsBilling" className="font-semibold">
                          Adresse de livraison identique à l'adresse de facturation
                        </Label>
                      </div>

                      {!sameAsBilling && (
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="livraison_nom">Nom</Label>
                              <Input
                                id="livraison_nom"
                                value={formData.livraison_nom}
                                onChange={(e) => handleInputChange('livraison_nom', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="livraison_prenom">Prénom</Label>
                              <Input
                                id="livraison_prenom"
                                value={formData.livraison_prenom}
                                onChange={(e) => handleInputChange('livraison_prenom', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="livraison_email">Email</Label>
                              <Input
                                id="livraison_email"
                                type="email"
                                value={formData.livraison_email}
                                onChange={(e) => handleInputChange('livraison_email', e.target.value)}
                                autoComplete="email"
                              />
                            </div>
                            <div>
                              <Label htmlFor="livraison_phone">Téléphone</Label>
                              <Input
                                id="livraison_phone"
                                type="tel"
                                value={formData.livraison_phone}
                                onChange={(e) => handleInputChange('livraison_phone', e.target.value)}
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

                          <div>
                            <Label htmlFor="livraison_adresse1">Adresse ligne 1</Label>
                            <Input
                              id="livraison_adresse1"
                              value={formData.livraison_adresse1}
                              onChange={(e) => handleInputChange('livraison_adresse1', e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="livraison_adresse2">Adresse ligne 2</Label>
                            <Input
                              id="livraison_adresse2"
                              value={formData.livraison_adresse2}
                              onChange={(e) => handleInputChange('livraison_adresse2', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 mr-2" />
                          Confirmer la commande
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ShoppingCart className="h-5 w-5" />
                    Votre commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {items.map((item) => {
                      const price = (item.product as any).prix || (item.product as any).price || 0;
                      const productName = (item.product as any).designation_fr || (item.product as any).name;
                      const productImage = (item.product as any).cover 
                        ? getStorageUrl((item.product as any).cover) 
                        : null;
                      return (
                        <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {productImage && (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
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
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {productName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {(price * item.quantity).toFixed(0)} TND
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {price.toFixed(0)} TND / unité
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span className="font-semibold">{totalPrice.toFixed(0)} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expédition</span>
                      <span className={shippingCost === 0 ? 'text-green-600 dark:text-green-400 font-semibold' : 'font-semibold'}>
                        {shippingCost === 0 ? 'Livraison gratuite' : `AFEX LIVRAISON 3/4 JRS: ${shippingCost} DT`}
                      </span>
                    </div>
                    {totalPrice < FREE_SHIPPING_THRESHOLD && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ajoutez {(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(0)} DT pour bénéficier de la livraison gratuite
                      </p>
                    )}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-red-600 dark:text-red-400">
                        {finalTotal.toFixed(0)} DT
                      </span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Livraison rapide</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                      <span>Garantie qualité</span>
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
