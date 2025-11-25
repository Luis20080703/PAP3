<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('equipa_escalao', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipa_id')->constrained()->onDelete('cascade');
            $table->foreignId('escalao_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['equipa_id', 'escalao_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('equipa_escalao');
    }
};
