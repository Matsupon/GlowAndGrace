<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'status',
        'status_description'
    ];

    protected $attributes = [
        'status' => 'Pickup',
        'status_description' => 'Order is placed'
    ];

    protected $with = ['order', 'product'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}