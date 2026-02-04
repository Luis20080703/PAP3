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
        Schema::create('atleta_jogo_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atleta_id')->constrained('atletas')->onDelete('cascade');
            $table->foreignId('jogo_id')->constrained('jogos')->onDelete('cascade');
            $table->integer('golos')->default(0);
            $table->integer('amarelo')->default(0);
            $table->integer('vermelho')->default(0);
            $table->integer('dois_minutos')->default(0);
            $table->timestamps();
            
            // Garantir que não há duplicados de estatística para o mesmo atleta no mesmo jogo
            $table->unique(['atleta_id', 'jogo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atleta_jogo_stats');
    }
};
