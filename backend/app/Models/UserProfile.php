<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $table = 'user_profiles';

    protected $fillable = [
        'user_id',
        'workshop_id',
        'division_id',
        'nomor_telepon',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Workshop
    public function workshop()
    {
        return $this->belongsTo(Workshop::class);
    }

    // Relasi ke Division
    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}