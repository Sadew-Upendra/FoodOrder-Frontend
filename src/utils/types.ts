// Enums 
export type Role = 'ADMIN' | 'CUSTOMER'
export type FoodStatus = 'AVAILABLE' | 'OUT_OF_STOCK'
export type OrderStatus = 'PLACED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

// Auth 
export interface JWTResponse { token: string; userId: string; email: string; name: string; role: Role }
export interface LoginDto { email: string; password: string }
export interface SignUpDto { name: string; email: string; password: string; phone?: string; address?: string }

// User 
export interface UserDto { userId: string; name: string; email: string; phone?: string; address?: string; role: Role }

// Category
export interface CategoryResponse { categoryId: string; name: string; description?: string; imageUrl?: string; foodItemCount: number }
export interface CategoryRequest { name: string; description?: string; imageUrl?: string }

// Food 
export interface FoodItemResponse { foodItemId: string; name: string; description?: string; price: number; imageUrl?: string; status: FoodStatus; categoryId: string; categoryName: string }
export interface FoodItemRequest { name: string; description?: string; price: number; imageUrl?: string; status: FoodStatus; categoryId: string }

// Cart 
export interface CartItemResponse { id: number; foodItemId: string; foodItemName: string; foodItemImage?: string; quantity: number; unitPrice: number; subtotal: number }
export interface CartResponse { cartId: number; userId: string; items: CartItemResponse[]; totalPrice: number; totalItems: number }
export interface CartItemRequest { foodItemId: string; quantity: number }

// Order
export interface OrderItemResponse { orderItemId: number; foodItemId: string; foodItemName: string; quantity: number; unitPrice: number; subtotal: number }
export interface OrderResponse { orderId: string; userId: string; userName: string; orderItems: OrderItemResponse[]; totalAmount: number; status: OrderStatus; orderDate: string; deliveryAddress: string; payment?: PaymentResponse }
export interface OrderRequest { deliveryAddress: string }

// Payment 
export interface PaymentResponse { paymentId: string; orderId: string; amount: number; status: PaymentStatus; paymentDate?: string; transactionId?: string }
export interface PaymentRequest { orderId: string; transactionId?: string }
