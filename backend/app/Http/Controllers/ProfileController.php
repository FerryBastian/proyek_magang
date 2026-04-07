<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * GET /api/profile
     * Ambil profil user yang sedang login.
     */
    public function show()
    {
        $profile = UserProfile::with(['workshop', 'division'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$profile) {
            return response()->json([
                'user_id'       => Auth::id(),
                'workshop_id'   => null,
                'division_id'   => null,
                'nomor_telepon' => null,
                'workshop'      => null,
                'division'      => null,
            ]);
        }

        return response()->json($profile);
    }

    /**
     * PUT /api/profile
     * Simpan atau update profil user (upsert).
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'workshop_id'   => 'nullable|exists:workshops,id',
            'division_id'   => 'nullable|exists:divisions,id',
            'nomor_telepon' => 'nullable|string|max:20',
        ]);

        $profile = UserProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        // Load relasi untuk response lengkap
        $profile->load(['workshop', 'division']);

        return response()->json($profile);
    }
}