<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WorkshopAndDivisionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Seed Workshops
        DB::table('workshops')->insert([
           
            ['name' => 'Workshop Bener (Trainseat / Inventory)', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Workshop SMK Pelita', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Workshop SMK Nusapersada', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Kantor DTECH-ENGINEERING', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Workshop SMK Muhammadiyah Salatiga', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
        ]);

        // Seed Divisions (sesuaikan nama divisinya)
        DB::table('divisions')->insert([
            ['name' => 'Divisi IT', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Divisi Produksi', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Divisi Administrasi', 'description' => null, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}