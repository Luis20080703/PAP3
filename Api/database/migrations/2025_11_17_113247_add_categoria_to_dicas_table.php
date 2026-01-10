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
        Schema::table('dicas', function (Blueprint $table) {
            if (!Schema::hasColumn('dicas', 'categoria')) {
                $table->enum('categoria', ['finta', 'drible', 'remate', 'defesa', 'táctica'])
                    ->default('táctica')
                    ->after('conteudo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dicas', function (Blueprint $table) {
            $table->dropColumn('categoria');
        });
    }
};
