import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, forkJoin } from 'rxjs';

export interface Product {
  id: number | string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  subCategory?: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  isSale?: boolean;
  saleTag?: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private fakeStoreUrl = 'https://fakestoreapi.com';
  private dummyJsonUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  // ================= FALLBACK DATA =================

  private fallbackMenProducts: Product[] = [
    {
      id: 'm-1',
      title: 'Oxford Formal Cotton Shirt',
      price: 49.99,
      originalPrice: 69.99,
      description: 'Classic premium cotton formal oxford shirt for office and casual wear.',
      category: "men's clothing",
      subCategory: 'Shirts',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.8, count: 142 },
      colors: ['#3b82f6', '#ffffff', '#1e293b'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'm-2',
      title: 'Slim-Fit Linen Casual Shirt',
      price: 39.99,
      originalPrice: 55.00,
      description: 'Breathable lightweight linen shirt perfect for summer and everyday comfort.',
      category: "men's clothing",
      subCategory: 'Shirts',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.6, count: 98 },
      colors: ['#93c5fd', '#f8fafc', '#d97706'],
      sizes: ['M', 'L', 'XL']
    },
    {
      id: 'm-3',
      title: 'Premium Tailored Navy Suit',
      price: 189.99,
      originalPrice: 249.99,
      description: 'Handcrafted tailored wool blend navy blazer and trousers for modern gentlemen.',
      category: "men's clothing",
      subCategory: 'Suits',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'SALE',
      rating: { rate: 4.9, count: 210 },
      colors: ['#0f172a', '#1e3a8a', '#334155'],
      sizes: ['M', 'L', 'XL', 'XXL']
    },
    {
      id: 'm-4',
      title: 'Classic Leather Brogue Shoes',
      price: 119.99,
      originalPrice: 159.99,
      description: 'Genuine leather oxford brogue shoes with cushioned insole and rubber outsole.',
      category: "men's clothing",
      subCategory: 'Shoes',
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 180 },
      colors: ['#78350f', '#000000'],
      sizes: ['41', '42', '43', '44', '45']
    },
    {
      id: 'm-5',
      title: 'Chronograph Minimalist Watch',
      price: 149.99,
      originalPrice: 199.99,
      description: 'Stainless steel sapphire glass chronograph watch with genuine leather strap.',
      category: "men's clothing",
      subCategory: 'Watches',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'TOP',
      rating: { rate: 4.9, count: 320 },
      colors: ['#d97706', '#1f2937', '#9ca3af']
    },
    {
      id: 'm-6',
      title: 'Vintage Leather Weekender Bag',
      price: 129.99,
      originalPrice: 179.99,
      description: 'Spacious handcrafted full-grain leather travel duffel bag with brass hardware.',
      category: "men's clothing",
      subCategory: 'Bags',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.8, count: 85 },
      colors: ['#78350f', '#0f172a']
    },
    {
      id: 'm-7',
      title: 'Dark Wash Straight Denim Jeans',
      price: 59.99,
      originalPrice: 79.99,
      description: 'Stretch comfort durable classic dark wash denim jeans with 5 pockets.',
      category: "men's clothing",
      subCategory: 'Pants',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'SALE',
      rating: { rate: 4.5, count: 165 },
      colors: ['#1e3a8a', '#1e293b'],
      sizes: ['30', '32', '34', '36']
    },
    {
      id: 'm-8',
      title: 'Urban Wool Bomber Jacket',
      price: 99.99,
      originalPrice: 139.99,
      description: 'Warm and stylish wool blend bomber jacket with ribbed collar and cuffs.',
      category: "men's clothing",
      subCategory: 'Jackets',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 110 },
      colors: ['#111827', '#4b5563'],
      sizes: ['M', 'L', 'XL']
    },
    {
      id: 'm-9',
      title: 'Modern Slim-Fit Chino Pants',
      price: 49.99,
      originalPrice: 69.99,
      description: 'Versatile stretch cotton chino trousers tailored for work and weekend wear.',
      category: "men's clothing",
      subCategory: 'Pants',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.8, count: 175 },
      colors: ['#78350f', '#0f172a', '#64748b'],
      sizes: ['30', '32', '34', '36']
    },
    {
      id: 'm-10',
      title: 'Classic Denim Trucker Jacket',
      price: 79.99,
      originalPrice: 109.99,
      description: 'Durable vintage dark wash cotton denim jacket with brass button closures.',
      category: "men's clothing",
      subCategory: 'Jackets',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.6, count: 140 },
      colors: ['#1e3a8a', '#1e293b'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'm-11',
      title: 'Classic Polarized Aviator Sunglasses',
      price: 34.99,
      originalPrice: 49.99,
      description: 'Lightweight alloy frame sunglasses with UV400 protection polarized lenses.',
      category: "men's clothing",
      subCategory: 'Watches',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'NEW',
      rating: { rate: 4.7, count: 210 },
      colors: ['#d97706', '#111827']
    },
    {
      id: 'm-12',
      title: 'Full-Grain Leather Bifold Wallet',
      price: 29.99,
      originalPrice: 39.99,
      description: 'Handmade genuine leather wallet with RFID blocking layer and coin pouch.',
      category: "men's clothing",
      subCategory: 'Bags',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.9, count: 310 },
      colors: ['#78350f', '#0f172a']
    }
  ];

  private fallbackWomenProducts: Product[] = [
    {
      id: 'w-1',
      title: 'Floral Summer Wrap Dress',
      price: 54.99,
      originalPrice: 74.99,
      description: 'Elegant breathable floral chiffon midi dress with flutter sleeves.',
      category: "women's clothing",
      subCategory: 'Dresses',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.9, count: 280 },
      colors: ['#f43f5e', '#fbbf24', '#3b82f6'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: 'w-2',
      title: 'Pleated Chiffon Midi Skirt',
      price: 44.99,
      originalPrice: 59.99,
      description: 'High-waisted elegant pleated midi skirt with smooth satin finish.',
      category: "women's clothing",
      subCategory: 'Skirts',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 140 },
      colors: ['#ec4899', '#1e293b', '#e2e8f0'],
      sizes: ['S', 'M', 'L']
    },
    {
      id: 'w-3',
      title: 'Designer Leather Tote Bag',
      price: 139.99,
      originalPrice: 189.99,
      description: 'Structured genuine leather tote with gold-tone hardware and top zipper.',
      category: "women's clothing",
      subCategory: 'Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'SALE',
      rating: { rate: 4.8, count: 195 },
      colors: ['#b91c1c', '#18181b', '#d97706']
    },
    {
      id: 'w-4',
      title: 'Classic Pointed Toe Stiletto Heels',
      price: 89.99,
      originalPrice: 119.99,
      description: 'Refined patent leather pointed pump heels with comfortable cushioned footbed.',
      category: "women's clothing",
      subCategory: 'Shoes',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.6, count: 130 },
      colors: ['#0284c7', '#000000', '#f43f5e'],
      sizes: ['36', '37', '38', '39', '40']
    },
    {
      id: 'w-5',
      title: 'Layered Gold Pendant Necklace',
      price: 34.99,
      originalPrice: 49.99,
      description: '18k gold plated multi-layer delicate chain necklace with coin pendant.',
      category: "women's clothing",
      subCategory: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'NEW',
      rating: { rate: 4.9, count: 310 },
      colors: ['#eab308', '#cbd5e1']
    },
    {
      id: 'w-6',
      title: 'Casual Ribbed Knit Top',
      price: 29.99,
      originalPrice: 39.99,
      description: 'Soft stretch ribbed knit crewneck top for chic daily outfits.',
      category: "women's clothing",
      subCategory: 'Tops',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.5, count: 88 },
      colors: ['#f472b6', '#ffffff', '#1e293b'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: 'w-7',
      title: 'Luxury Evening Clutch Bag',
      price: 69.99,
      originalPrice: 99.99,
      description: 'Metallic finish evening clutch purse with detachable chain shoulder strap.',
      category: "women's clothing",
      subCategory: 'Bags',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.8, count: 172 },
      colors: ['#f59e0b', '#d97706', '#1f2937']
    },
    {
      id: 'w-8',
      title: 'Velvet Matte Lipstick Set',
      price: 24.99,
      originalPrice: 35.00,
      description: 'Long-lasting hydrating velvet matte lipstick set in iconic nude & red tones.',
      category: "women's clothing",
      subCategory: 'Beauty',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.9, count: 420 },
      colors: ['#dc2626', '#be123c', '#9f1239']
    },
    {
      id: 'w-9',
      title: 'Tailored Wool Trench Coat',
      price: 129.99,
      originalPrice: 169.99,
      description: 'Sophisticated belted double-breasted long trench coat crafted for timeless warmth.',
      category: "women's clothing",
      subCategory: 'Dresses',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'SALE',
      rating: { rate: 4.9, count: 210 },
      colors: ['#d97706', '#1e293b', '#64748b'],
      sizes: ['S', 'M', 'L']
    },
    {
      id: 'w-10',
      title: 'High-Waisted Stretch Skinny Jeans',
      price: 54.99,
      originalPrice: 74.99,
      description: 'Figure-sculpting dark indigo blue stretch denim jeans with 5 pockets.',
      category: "women's clothing",
      subCategory: 'Skirts',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 185 },
      colors: ['#1e3a8a', '#0f172a'],
      sizes: ['26', '28', '30', '32']
    },
    {
      id: 'w-11',
      title: 'Chic Leather Ankle Boots',
      price: 99.99,
      originalPrice: 139.99,
      description: 'Sleek block heel genuine leather side-zip ankle boots for effortless fashion.',
      category: "women's clothing",
      subCategory: 'Shoes',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.8, count: 260 },
      colors: ['#0f172a', '#78350f'],
      sizes: ['37', '38', '39', '40']
    },
    {
      id: 'w-12',
      title: 'Cat-Eye Designer Sunglasses',
      price: 44.99,
      originalPrice: 59.99,
      description: 'Chic retro cat-eye sunglasses with gradient lenses and acetate frame.',
      category: "women's clothing",
      subCategory: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.6, count: 140 },
      colors: ['#000000', '#78350f']
    },
    {
      id: 'w-13',
      title: 'Diamond Cut Gold Hoop Earrings',
      price: 29.99,
      originalPrice: 44.99,
      description: 'Handcrafted 18k gold polished hoop earrings for effortless elegance.',
      category: "women's clothing",
      subCategory: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.9, count: 215 },
      colors: ['#eab308', 'gold', '#f8fafc']
    },
    {
      id: 'w-14',
      title: 'Sterling Silver Crystal Tennis Bracelet',
      price: 49.99,
      originalPrice: 69.99,
      description: 'Sparkling cubic zirconia crystal tennis bracelet set in 925 sterling silver.',
      category: "women's clothing",
      subCategory: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.8, count: 180 },
      colors: ['#f8fafc', '#ffffff', 'white']
    },
    {
      id: 'w-15',
      title: 'Freshwater Pearl Pendant Necklace',
      price: 39.99,
      originalPrice: 55.00,
      description: 'Lustrous natural freshwater pearl pendant on a gold vermeil link chain.',
      category: "women's clothing",
      subCategory: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'NEW',
      rating: { rate: 4.9, count: 190 },
      colors: ['#eab308', '#f472b6', 'gold', 'pink']
    },
    {
      id: 'w-16',
      title: 'Hydrating Botanical Glow Skin Oil',
      price: 34.99,
      originalPrice: 49.99,
      description: 'Nourishing facial oil infused with rosehip, jojoba, and Vitamin E.',
      category: "women's clothing",
      subCategory: 'Beauty',
      image: 'https://images.unsplash.com/photo-1608248597261-833258657b39?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.9, count: 520 },
      colors: ['#ec4899', '#f472b6', 'pink']
    },
    {
      id: 'w-17',
      title: 'Warm Nude Eyeshadow Palette',
      price: 29.99,
      originalPrice: 39.99,
      description: '12 highly pigmented matte and shimmer warm nude eyeshadow shades.',
      category: "women's clothing",
      subCategory: 'Beauty',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.8, count: 340 },
      colors: ['#78350f', '#eab308', 'gold', 'brown']
    },
    {
      id: 'w-18',
      title: 'Rose & Vanilla Luxury Perfume Oil',
      price: 59.99,
      originalPrice: 79.99,
      description: 'Long-lasting floral fragrance eau de parfum with notes of damask rose and vanilla.',
      category: "women's clothing",
      subCategory: 'Beauty',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'NEW',
      rating: { rate: 4.9, count: 410 },
      colors: ['#ef4444', '#ec4899', 'red', 'pink']
    },
    {
      id: 'w-19',
      title: 'Satin Backless Evening Maxi Dress',
      price: 89.99,
      originalPrice: 119.99,
      description: 'Floor-length silky satin gown featuring a halter neck and thigh slit.',
      category: "women's clothing",
      subCategory: 'Dresses',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.9, count: 165 },
      colors: ['#ef4444', '#0f172a', 'red', 'black']
    },
    {
      id: 'w-20',
      title: 'Pure Silk V-Neck Office Blouse',
      price: 49.99,
      originalPrice: 69.99,
      description: 'Soft Mulberry silk long-sleeve blouse for polished professional style.',
      category: "women's clothing",
      subCategory: 'Tops',
      image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 120 },
      colors: ['#ffffff', '#3b82f6', 'white', 'blue']
    },
    {
      id: 'w-21',
      title: 'High-Waisted Satin Floral Mini Skirt',
      price: 34.99,
      originalPrice: 49.99,
      description: 'Chic floral print satin A-line mini skirt with hidden side zipper.',
      category: "women's clothing",
      subCategory: 'Skirts',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'SALE',
      rating: { rate: 4.6, count: 95 },
      colors: ['#ec4899', '#f472b6', 'pink']
    },
    {
      id: 'w-22',
      title: 'Platform Minimalist Leather Sneakers',
      price: 69.99,
      originalPrice: 89.99,
      description: 'Ultra-cushioned white leather low-top platform everyday sneakers.',
      category: "women's clothing",
      subCategory: 'Shoes',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.8, count: 280 },
      colors: ['#ffffff', '#f8fafc', 'white']
    },
    {
      id: 'w-23',
      title: 'Strappy Block Heel Leather Sandals',
      price: 49.99,
      originalPrice: 65.00,
      description: 'Open-toe strappy ankle wrap block heel sandals in soft tan leather.',
      category: "women's clothing",
      subCategory: 'Shoes',
      image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 145 },
      colors: ['#78350f', '#0f172a', 'brown', 'black']
    },
    {
      id: 'w-24',
      title: 'Oversized Cashmere Knit Sweater',
      price: 79.99,
      originalPrice: 109.99,
      description: 'Cozy luxurious 100% Mongolian cashmere drop-shoulder sweater.',
      category: "women's clothing",
      subCategory: 'Tops',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'NEW',
      rating: { rate: 4.9, count: 230 },
      colors: ['#64748b', '#ec4899', 'grey', 'pink']
    }
  ];

  private fallbackElectronicsProducts: Product[] = [
    {
      id: 'e-1',
      title: 'Ultra-Slim Pro Laptop 15.6"',
      price: 899.99,
      originalPrice: 1099.99,
      description: 'High-performance laptop with 16GB RAM, 512GB SSD, Intel i7 and 4K IPS display.',
      category: 'electronics',
      subCategory: 'Laptops',
      brand: 'TechPro',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'DEAL',
      rating: { rate: 4.9, count: 350 },
      colors: ['#64748b', '#0f172a', '#e2e8f0']
    },
    {
      id: 'e-2',
      title: 'Flagship 5G Smartphone 256GB',
      price: 699.99,
      originalPrice: 799.99,
      description: '120Hz AMOLED display, 108MP AI triple camera, and ultra-fast charging.',
      category: 'electronics',
      subCategory: 'Smartphones',
      brand: 'NovaTech',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.8, count: 520 },
      colors: ['#0284c7', '#0f172a', '#f8fafc']
    },
    {
      id: 'e-3',
      title: 'Active Noise Cancelling Wireless Headphones',
      price: 149.99,
      originalPrice: 199.99,
      description: 'Immersive sound with 40-hour battery life, ANC, and ultra-soft memory ear cushions.',
      category: 'electronics',
      subCategory: 'Audio',
      brand: 'SonicWave',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.9, count: 640 },
      colors: ['#1e293b', '#f8fafc', '#d97706']
    },
    {
      id: 'e-4',
      title: 'Smart Fitness Watch Series 7',
      price: 129.99,
      originalPrice: 169.99,
      description: 'Heart rate monitor, SPO2, GPS tracking, water resistant up to 50m with AMOLED screen.',
      category: 'electronics',
      subCategory: 'Wearables',
      brand: 'PulseGear',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 290 },
      colors: ['#000000', '#64748b', '#ec4899']
    },
    {
      id: 'e-5',
      title: 'Portable Waterproof Bluetooth Speaker',
      price: 59.99,
      originalPrice: 89.99,
      description: '360-degree deep bass, IPX7 waterproof rating, 24-hour playtime for outdoors.',
      category: 'electronics',
      subCategory: 'Audio',
      brand: 'BassBoom',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'SALE',
      rating: { rate: 4.7, count: 215 },
      colors: ['#0f172a', '#dc2626', '#2563eb']
    },
    {
      id: 'e-6',
      title: 'Wireless RGB Gaming Controller',
      price: 64.99,
      originalPrice: 79.99,
      description: 'Ergonomic multi-platform wireless controller with programmable back paddles.',
      category: 'electronics',
      subCategory: 'Gaming',
      brand: 'PlayPro',
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.6, count: 180 },
      colors: ['#0f172a', '#7c3aed']
    },
    {
      id: 'e-7',
      title: 'True Wireless Earbuds with ANC',
      price: 79.99,
      originalPrice: 119.99,
      description: 'Crystal clear calls, wireless charging case, low latency gaming mode.',
      category: 'electronics',
      subCategory: 'Audio',
      brand: 'SonicWave',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'POPULAR',
      rating: { rate: 4.8, count: 410 },
      colors: ['#ffffff', '#0f172a']
    },
    {
      id: 'e-8',
      title: 'Next-Gen Gaming Console System',
      price: 499.99,
      originalPrice: 549.99,
      description: '8K HDR gaming, ultra-high speed 1TB SSD, 120fps with ray tracing support.',
      category: 'electronics',
      subCategory: 'Gaming',
      brand: 'PlayPro',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 5.0, count: 780 },
      colors: ['#f8fafc', '#0f172a']
    },
    {
      id: 'e-9',
      title: 'RGB Mechanical Gaming Keyboard',
      price: 89.99,
      originalPrice: 119.99,
      description: 'Hot-swappable linear mechanical switches with customizable per-key RGB backlight.',
      category: 'electronics',
      subCategory: 'Gaming',
      brand: 'TechPro',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'DEAL',
      rating: { rate: 4.9, count: 320 },
      colors: ['#0f172a', '#7c3aed']
    },
    {
      id: 'e-10',
      title: 'Wireless Ergonomic Optical Mouse',
      price: 39.99,
      originalPrice: 59.99,
      description: 'Precision 16000 DPI sensor with ergonomic thumb rest and dual Bluetooth connectivity.',
      category: 'electronics',
      subCategory: 'Laptops',
      brand: 'TechPro',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.7, count: 230 },
      colors: ['#0f172a', '#64748b']
    },
    {
      id: 'e-11',
      title: '4K Ultra HD Smart TV 55"',
      price: 599.99,
      originalPrice: 749.99,
      description: 'Quantum Dot HDR display with built-in voice assistant and ultra-bezel-less design.',
      category: 'electronics',
      subCategory: 'Smartphones',
      brand: 'NovaTech',
      image: 'https://images.unsplash.com/photo-1593784991095-87710daf6561?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: true,
      saleTag: 'HOT',
      rating: { rate: 4.9, count: 480 },
      colors: ['#0f172a']
    },
    {
      id: 'e-12',
      title: 'High-Capacity 20000mAh Power Bank',
      price: 34.99,
      originalPrice: 49.99,
      description: '65W Power Delivery fast-charging power bank capable of charging laptops and phones.',
      category: 'electronics',
      subCategory: 'Wearables',
      brand: 'PulseGear',
      image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=500&q=75&fm=webp',
      isSale: false,
      rating: { rate: 4.8, count: 290 },
      colors: ['#000000', '#ffffff']
    }
  ];

  // ================= API METHODS =================

  /** Filter method to remove invalid or broken products */
  private isValidProduct(p: Product): boolean {
    if (!p) return false;
    if (!p.id || !p.title || typeof p.title !== 'string' || p.title.trim() === '') return false;
    if (typeof p.price !== 'number' || isNaN(p.price) || p.price <= 0) return false;
    if (
      !p.image ||
      typeof p.image !== 'string' ||
      p.image.trim() === '' ||
      p.image.includes('null') ||
      p.image.includes('undefined')
    ) {
      return false;
    }
    return true;
  }

  getMenProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.fakeStoreUrl}/products/category/men's%20clothing`).pipe(
      map(apiProducts => {
        if (!apiProducts || apiProducts.length === 0) return this.fallbackMenProducts.filter(p => this.isValidProduct(p));
        const mapped = apiProducts.map(p => this.mapFakeStoreProduct(p, 'men')).filter(p => this.isValidProduct(p));
        return this.mergeUnique(mapped, this.fallbackMenProducts);
      }),
      catchError(() => of(this.fallbackMenProducts.filter(p => this.isValidProduct(p))))
    );
  }

  getWomenProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.fakeStoreUrl}/products/category/women's%20clothing`).pipe(
      map(apiProducts => {
        if (!apiProducts || apiProducts.length === 0) return this.fallbackWomenProducts.filter(p => this.isValidProduct(p));
        const mapped = apiProducts.map(p => this.mapFakeStoreProduct(p, 'women')).filter(p => this.isValidProduct(p));
        return this.mergeUnique(mapped, this.fallbackWomenProducts);
      }),
      catchError(() => of(this.fallbackWomenProducts.filter(p => this.isValidProduct(p))))
    );
  }

  getElectronicsProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.fakeStoreUrl}/products/category/electronics`).pipe(
      map(apiProducts => {
        if (!apiProducts || apiProducts.length === 0) return this.fallbackElectronicsProducts.filter(p => this.isValidProduct(p));
        const mapped = apiProducts.map(p => this.mapFakeStoreProduct(p, 'electronics')).filter(p => this.isValidProduct(p));
        return this.mergeUnique(mapped, this.fallbackElectronicsProducts);
      }),
      catchError(() => of(this.fallbackElectronicsProducts.filter(p => this.isValidProduct(p))))
    );
  }

  getHotDeals(): Observable<Product[]> {
    const deals = [
      this.fallbackWomenProducts[2],  // Leather Tote Bag
      this.fallbackWomenProducts[0],  // Floral Dress
      this.fallbackWomenProducts[6],  // Luxury Clutch
      this.fallbackWomenProducts[3],  // High Heels
      this.fallbackMenProducts[4],    // Chronograph Watch
      this.fallbackElectronicsProducts[3], // Smart Watch
      this.fallbackMenProducts[5],    // Leather Bag
      this.fallbackElectronicsProducts[5], // Gaming Controller
      this.fallbackMenProducts[8],    // Chino Pants
      this.fallbackWomenProducts[8],   // Trench Coat
      this.fallbackElectronicsProducts[8], // RGB Keyboard
      this.fallbackMenProducts[0],    // Oxford Shirt
      // Second page (12 products)
      this.fallbackElectronicsProducts[0], // Wireless Headphones
      this.fallbackWomenProducts[1],  // Silk Blouse
      this.fallbackMenProducts[2],    // Italian Wool Suit
      this.fallbackElectronicsProducts[2], // OLED Smartphone
      this.fallbackWomenProducts[5],  // Gold Earrings
      this.fallbackMenProducts[6],    // Leather Sneakers
      this.fallbackElectronicsProducts[1], // Ultra Laptop
      this.fallbackWomenProducts[4],  // Gold Necklace
      this.fallbackMenProducts[1],    // Linen Shirt
      this.fallbackElectronicsProducts[7], // 4K Webcam
      this.fallbackWomenProducts[9],  // Denim Jacket
      this.fallbackMenProducts[11]    // Leather Wallet
    ].filter(p => this.isValidProduct(p));

    return of(deals);
  }

  getLatestArrivals(): Observable<Product[]> {
    const arrivals = [
      this.fallbackMenProducts[1],        // Linen shirt
      this.fallbackWomenProducts[7],      // Lipstick set
      this.fallbackMenProducts[7],        // Wool bomber
      this.fallbackElectronicsProducts[4],// Bluetooth speaker
      this.fallbackWomenProducts[4],      // Necklace
      this.fallbackMenProducts[3],        // Brogue shoes
      this.fallbackMenProducts[9],        // Denim jacket
      this.fallbackWomenProducts[10],     // Ankle boots
      this.fallbackElectronicsProducts[6],// Noise Earbuds
      this.fallbackWomenProducts[11],     // Sunglasses
      this.fallbackMenProducts[10],       // Wool Sweater
      this.fallbackElectronicsProducts[9],// Fitness Tracker
      // Second page (12 products)
      this.fallbackMenProducts[4],        // Watch
      this.fallbackWomenProducts[2],      // Tote bag
      this.fallbackElectronicsProducts[10],// Drone
      this.fallbackMenProducts[5],        // Leather backpack
      this.fallbackWomenProducts[3],      // Heels
      this.fallbackElectronicsProducts[11],// Charging station
      this.fallbackMenProducts[0],        // Oxford shirt
      this.fallbackWomenProducts[0],      // Floral dress
      this.fallbackElectronicsProducts[3],// Smart watch
      this.fallbackWomenProducts[6],      // Clutch
      this.fallbackMenProducts[2],        // Italian suit
      this.fallbackElectronicsProducts[0] // Headphones
    ].filter(p => this.isValidProduct(p));

    return of(arrivals);
  }

  getAllProducts(): Observable<Product[]> {
    const all = [
      ...this.fallbackMenProducts,
      ...this.fallbackWomenProducts,
      ...this.fallbackElectronicsProducts
    ].filter(p => this.isValidProduct(p));

    return of(all);
  }

  private findFallbackProduct(id: string | number): Product | undefined {
    const all = [
      ...this.fallbackMenProducts,
      ...this.fallbackWomenProducts,
      ...this.fallbackElectronicsProducts
    ].filter(p => this.isValidProduct(p));
    return all.find(p => String(p.id) === String(id));
  }

  getProductById(id: string | number): Observable<Product | undefined> {
    const isApiId = !isNaN(Number(id)) && !String(id).includes('-');

    if (isApiId) {
      return this.http.get<any>(`${this.fakeStoreUrl}/products/${id}`).pipe(
        map(apiProd => {
          if (apiProd && apiProd.id) {
            const category = apiProd.category || '';
            const type = category.includes('men') ? 'men' : category.includes('women') ? 'women' : 'electronics';
            return this.mapFakeStoreProduct(apiProd, type);
          }
          return this.findFallbackProduct(id);
        }),
        catchError(() => of(this.findFallbackProduct(id)))
      );
    }

    return of(this.findFallbackProduct(id));
  }

  private mapFakeStoreProduct(item: any, type: string): Product {
    return {
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: +(item.price * 1.25).toFixed(2),
      description: item.description,
      category: item.category,
      subCategory: type === 'men' ? 'Clothing' : type === 'women' ? 'Style' : 'Gadget',
      image: item.image,
      rating: item.rating,
      isSale: item.price > 50,
      saleTag: item.price > 50 ? 'SALE' : undefined,
      colors: ['#1e293b', '#3b82f6', '#d97706'],
      sizes: ['S', 'M', 'L', 'XL']
    };
  }

  private mergeUnique(apiList: Product[], fallbackList: Product[]): Product[] {
    const combined = [...apiList.filter(p => this.isValidProduct(p))];
    for (const f of fallbackList) {
      if (this.isValidProduct(f) && !combined.some(c => c.title.toLowerCase() === f.title.toLowerCase())) {
        combined.push(f);
      }
    }
    return combined.filter(p => this.isValidProduct(p));
  }
}
