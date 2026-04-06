<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\AuthController;

// Agar URL /auth/google/... diarahkan ke Controller yang benar
Route::prefix('auth')->group(function () {
    // Menangani redirect & callback dari Google (Support POST dari GSI)
    Route::match(['get', 'post'], '/google/oauth/google', [AuthController::class, 'oauthGoogle']);
    Route::match(['get', 'post'], '/google/callback', [AuthController::class, 'oauthGoogle']);
    
    // Logout untuk Session Web
    Route::match(['get', 'post'], '/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logged out']);
    });
});

// Route Default
Route::get('/', fn() => view('welcome'));
Route::get('/login', fn() => view('auth.login'))->name('login');