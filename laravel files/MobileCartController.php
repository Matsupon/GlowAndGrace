<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MobileCartController extends Controller
{
    public function getCartItems()
    {
        $cartItems = Order::with('product')
            ->where('user_id', Auth::id())
            ->where('status', 'PendingOrder')
            ->get();

        return response()->json($cartItems);
    }

    public function addToCart(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);

            $product = Product::findOrFail($request->product_id);
            $totalAmount = $product->price * $request->quantity;

            $existingOrder = Order::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->where('status', 'PendingOrder')
                ->first();

            if ($existingOrder) {
                $existingOrder->quantity += $request->quantity;
                $existingOrder->total_amount = $product->price * $existingOrder->quantity;
                $existingOrder->save();
            } else {
                Order::create([
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                    'total_amount' => $totalAmount,
                    'status' => 'PendingOrder'
                ]);
            }

            $cartCount = Order::where('user_id', Auth::id())
                ->where('status', 'PendingOrder')
                ->sum('quantity');

            return response()->json([
                'message' => 'Product added to cart',
                'count' => $cartCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to add product to cart: ' . $e->getMessage()
            ], 500);
        }
    }

    public function removeFromCart($id)
    {
        try {
            $order = Order::where('user_id', Auth::id())
                ->where('id', $id)
                ->where('status', 'PendingOrder')
                ->firstOrFail();

            $order->delete();

            $cartCount = Order::where('user_id', Auth::id())
                ->where('status', 'PendingOrder')
                ->sum('quantity');

            return response()->json([
                'message' => 'Product removed from cart',
                'count' => $cartCount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to remove product from cart'
            ], 500);
        }
    }

    public function getCartCount()
    {
        $count = Order::where('user_id', Auth::id())
            ->where('status', 'PendingOrder')
            ->sum('quantity');
        return response()->json(['count' => $count]);
    }

    public function updateQuantity(Request $request, $id)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1'
            ]);

            $order = Order::where('user_id', Auth::id())
                ->where('id', $id)
                ->where('status', 'PendingOrder')
                ->firstOrFail();

            $product = Product::findOrFail($order->product_id);
            $order->quantity = $request->quantity;
            $order->total_amount = $product->price * $request->quantity;
            $order->save();

            return response()->json([
                'message' => 'Cart item quantity updated successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update cart item quantity: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkout(Request $request)
    {
        try {
            $request->validate([
                'order_ids' => 'required|array',
                'delivery_address' => 'required|string',
                'payment_method' => 'required|in:COD,card'
            ]);

            \Log::info('Checkout request data:', $request->all());

            $orders = Order::whereIn('id', $request->order_ids)
                ->where('user_id', Auth::id())
                ->where('status', 'PendingOrder')
                ->get();

            if ($orders->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'error' => 'No valid orders found'
                ], 404);
            }

            DB::beginTransaction();
            try {
                foreach ($orders as $order) {
                    $product = Product::find($order->product_id);
                    $order->update([
                        'status' => 'Ordered',
                        'delivery_address' => $request->delivery_address,
                        'payment_method' => $request->payment_method,
                        'product_name' => $product ? $product->name : null,
                        'product_image' => $product ? $product->image : null,
                    ]);

                    OrderDetail::create([
                        'order_id' => $order->id,
                        'product_id' => $order->product_id,
                        'quantity' => $order->quantity,
                        'total_amount' => $order->total_amount,
                        'status' => 'Pending',
                        'status_description' => 'Order is placed',
                    ]);
                }
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Order placed successfully'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            \Log::error('Checkout error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAllOrders()
    {
        try {
            $orders = Order::with(['product', 'user'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            \Log::error('Error fetching orders: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch orders: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMyOrdered()
    {
        $orders = Order::with('product')
            ->where('user_id', Auth::id())
            ->where('status', 'Ordered')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }
}