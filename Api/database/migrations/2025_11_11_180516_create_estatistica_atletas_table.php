<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('estatistica_atletas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atleta_id')->constrained()->onDelete('cascade');
            $table->integer('golos_marcados');
            $table->integer('epoca');
            $table->float('media_golos');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('estatistica_atletas');
    }
};
