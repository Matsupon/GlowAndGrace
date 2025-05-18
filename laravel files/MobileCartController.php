<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}