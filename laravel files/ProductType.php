<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    use HasFactory;

    protected $fillable = ['TypeName'];
    protected $table = 'producttypes';
    protected $primaryKey = 'TypeID';

    public function subtypes()
    {
        return $this->hasMany(ProductSubtype::class, 'TypeID', 'TypeID');
    }
}
