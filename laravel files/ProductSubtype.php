<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSubtype extends Model
{
    use HasFactory;

    protected $fillable = ['SubTypeName', 'TypeID'];
    protected $table = 'productsubtypes';

    public function type()
    {
        return $this->belongsTo(ProductType::class, 'TypeID', 'TypeID');
    }
}
