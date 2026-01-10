<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('treinadores', function (Blueprint $table) {
            $table->string('escalao')->nullable()->after('epoca_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('treinadores', function (Blueprint $table) {
            $table->dropColumn('escalao');
        });
    }
};
