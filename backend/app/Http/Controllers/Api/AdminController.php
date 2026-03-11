<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'total_users'       => User::count(),
                'total_submissions' => Submission::count(),
                'pending_count'     => Submission::where('status', 'pending')->count(),
                'approved_count'    => Submission::where('status', 'approved')->count(),
                'rejected_count'    => Submission::where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function submissions(): JsonResponse
    {
        $submissions = Submission::with([
            'user:id,name,email',
            'workshop',
            'division',
        ])->latest()->get();

        return response()->json($submissions);
    }

    public function updateStatus(Request $request, Submission $submission): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,review,approved,rejected',
        ]);

        $submission->update(['status' => $request->status]);

        // Kirim event notifikasi ke Socket.io server
        try {
            $response = Http::post('http://localhost:3001/emit-status', [
                'user_id'       => $submission->user_id,
                'submission_id' => $submission->id,
                'status'        => $submission->status,
                'title'         => $submission->title,
            ]);
            \Log::info('Socket response: ' . $response->body());
        } catch (\Exception $e) {
            \Log::error('Socket.io emit gagal: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Status updated',
            'data'    => $submission,
        ]);
    }
}