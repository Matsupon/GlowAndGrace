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
        try {
            $orderDetail = OrderDetail::findOrFail($id);
            $orderDetail->update([
                'status' => $request->status
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
} 