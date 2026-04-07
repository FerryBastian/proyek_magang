<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\WorkshopController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\AdminController;
use App\Models\Submission;
use App\Models\User;

Route::prefix('v1')->name('v1.')->group(function () {

    Route::get('/health', fn() => response()->json(['status' => 'ok'], 200))->name('health');

    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('auth.login');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1')->name('auth.register');
    Route::post('/oauth/google', [AuthController::class, 'oauthGoogle'])->middleware('throttle:10,1')->name('auth.google');

    Route::get('/workshops', [WorkshopController::class, 'index'])->name('workshops.index');
    Route::get('/divisions', [DivisionController::class, 'index'])->name('divisions.index');

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

        Route::get('/me', function (Request $request) {
            return response()->json(['user' => $request->user()]);
        })->name('auth.me');

        Route::post('/submit', [SubmissionController::class, 'store'])->name('submissions.store');
        Route::get('/my-submissions', [SubmissionController::class, 'mySubmissions'])->name('submissions.mine');
        Route::patch('/submissions/{submission}/cancel', [SubmissionController::class, 'cancel'])->name('submissions.cancel');

        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);

        Route::middleware('role:admin')->group(function () {
            Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
            Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users.index');
            Route::patch('/admin/users/{user}/role', [AdminController::class, 'updateRole'])->name('admin.users.role');
            Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser'])->name('admin.users.delete');
            Route::patch('/admin/users/{id}/restore', [AdminController::class, 'restoreUser'])->name('admin.users.restore');
            Route::get('/admin/submissions', [AdminController::class, 'submissions'])->name('admin.submissions.index');
            Route::patch('/admin/submissions/{submission}/status', [AdminController::class, 'updateStatus'])->name('admin.submissions.status');
            Route::get('/admin/workshops', [WorkshopController::class, 'adminIndex'])->name('admin.workshops.index');
            Route::post('/admin/workshops', [WorkshopController::class, 'store'])->name('admin.workshops.store');
            Route::put('/admin/workshops/{id}', [WorkshopController::class, 'update'])->name('admin.workshops.update');
            Route::delete('/admin/workshops/{id}', [WorkshopController::class, 'destroy'])->name('admin.workshops.destroy');
            Route::patch('/admin/workshops/{id}/restore', [WorkshopController::class, 'restore'])->name('admin.workshops.restore');
            Route::get('/admin/divisions', [DivisionController::class, 'adminIndex'])->name('admin.divisions.index');
            Route::post('/admin/divisions', [DivisionController::class, 'store'])->name('admin.divisions.store');
            Route::put('/admin/divisions/{id}', [DivisionController::class, 'update'])->name('admin.divisions.update');
            Route::delete('/admin/divisions/{id}', [DivisionController::class, 'destroy'])->name('admin.divisions.destroy');
            Route::patch('/admin/divisions/{id}/restore', [DivisionController::class, 'restore'])->name('admin.divisions.restore');
        });

        Route::middleware('role:user')->group(function () {
            Route::get('/user/dashboard', fn() => response()->json(['message' => 'Welcome User']))->name('user.dashboard');
        });
    });

    Route::fallback(fn() => response()->json(['message' => 'Endpoint not found'], 404))->name('fallback');
});