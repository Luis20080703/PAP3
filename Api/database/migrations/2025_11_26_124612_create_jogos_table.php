<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('jogos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipa_id')->constrained()->onDelete('cascade'); // equipa do utilizador
            $table->string('adversario'); // nome da equipa adversária
            $table->integer('golos_marcados');
            $table->integer('golos_sofridos');
            $table->date('data_jogo');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jogos');
    }
};
