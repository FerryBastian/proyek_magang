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

    // Public endpoints
    Route::get('/health', fn () => response()->json(['status' => 'ok'], 200))
        ->name('health');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('auth.login');

    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:5,1')
        ->name('auth.register');

    Route::post('/oauth/google', [AuthController::class, 'oauthGoogle'])
        ->middleware('throttle:10,1')
        ->name('auth.google');

    // Public dropdown — untuk form submission user
    Route::get('/workshops', [WorkshopController::class, 'index'])->name('workshops.index');
    Route::get('/divisions', [DivisionController::class, 'index'])->name('divisions.index');

    // Protected endpoints
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');

        Route::get('/me', function (Request $request) {
            return response()->json([
                'user' => $request->user(),
            ]);
        })->name('auth.me');

        // Submissions
        Route::post('/submit', [SubmissionController::class, 'store'])
            ->name('submissions.store');

        Route::get('/my-submissions', [SubmissionController::class, 'mySubmissions'])
            ->name('submissions.mine');

        // ADMIN ROUTES
        Route::middleware('role:admin')->group(function () {

            // Dashboard
            Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
                ->name('admin.dashboard');

            // Users list
            Route::get('/admin/users', function () {
                return response()->json(
                    User::where('role', 'user')->latest()->get()
                );
            })->name('admin.users.index');

            // Submissions
            Route::get('/admin/submissions', [AdminController::class, 'submissions'])
                ->name('admin.submissions.index');

            // Status update — pakai AdminController agar bisa emit socket
            Route::patch('/admin/submissions/{submission}/status', [AdminController::class, 'updateStatus'])
                ->name('admin.submissions.status');

            // Workshop CRUD
            Route::get('/admin/workshops', [WorkshopController::class, 'adminIndex'])->name('admin.workshops.index');
            Route::post('/admin/workshops', [WorkshopController::class, 'store'])->name('admin.workshops.store');
            Route::put('/admin/workshops/{id}', [WorkshopController::class, 'update'])->name('admin.workshops.update');
            Route::delete('/admin/workshops/{id}', [WorkshopController::class, 'destroy'])->name('admin.workshops.destroy');
            Route::patch('/admin/workshops/{id}/restore', [WorkshopController::class, 'restore'])->name('admin.workshops.restore');

            // Division CRUD
            Route::get('/admin/divisions', [DivisionController::class, 'adminIndex'])->name('admin.divisions.index');
            Route::post('/admin/divisions', [DivisionController::class, 'store'])->name('admin.divisions.store');
            Route::put('/admin/divisions/{id}', [DivisionController::class, 'update'])->name('admin.divisions.update');
            Route::delete('/admin/divisions/{id}', [DivisionController::class, 'destroy'])->name('admin.divisions.destroy');
            Route::patch('/admin/divisions/{id}/restore', [DivisionController::class, 'restore'])->name('admin.divisions.restore');
        });

        // USER ROUTES
        Route::middleware('role:user')->group(function () {
            Route::get('/user/dashboard', fn () => response()->json([
                'message' => 'Welcome User',
            ]))->name('user.dashboard');
        });
    });

    Route::fallback(fn () => response()->json([
        'message' => 'Endpoint not found',
    ], 404))->name('fallback');
});