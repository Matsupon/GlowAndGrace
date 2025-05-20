<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderDetailsController extends Controller
{
    public function getDetails($orderId)
    {
        try {
            $orderDetails = OrderDetail::where('order_id', $orderId)
                ->with(['order', 'product'])
                ->get();

            return response()->json($orderDetails);
        } catch (\Exception $e) {
            \Log::error('Order details error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch order details: ' . $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Shipping,Delivered',
        ]);
        try {
            $orderDetail = OrderDetail::findOrFail($id);
            $orderDetail->update([
                'status' => $validated['status']
            ]);

            return response()->json(['message' => 'Status updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Status update error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update status: ' . $e->getMessage()], 500);
        }
    }

    public function updateDescription(Request $request, $id)
    {
        try {
            $orderDetail = OrderDetail::findOrFail($id);
            $orderDetail->update([
                'status_description' => $request->status_description
            ]);

            return response()->json(['message' => 'Description updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Description update error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update description: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $orderDetail = OrderDetail::findOrFail($id);
            $orderDetail->delete();

            return response()->json(['message' => 'Order detail deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Order detail delete error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete order detail: ' . $e->getMessage()], 500);
        }
    }

    public function index()
    {
        try {
            $orderDetails = OrderDetail::whereHas('order', function($q) {
                $q->where('status', 'Ordered');
            })->with(['order', 'product'])->get();
            return response()->json($orderDetails);
        } catch (\Exception $e) {
            \Log::error('Order details fetch error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch order details: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'status' => 'nullable|in:Pending,Shipping,Delivered',
            'status_description' => 'nullable|string',
        ]);
        try {
            $orderDetail = OrderDetail::create($validated);
            return response()->json($orderDetail, 201);
        } catch (\Exception $e) {
            \Log::error('Order detail create error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create order detail: ' . $e->getMessage()], 500);
        }
    }
} 