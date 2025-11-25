<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('dicas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titulo');
            $table->text('conteudo');
            $table->string('ficheiro')->nullable();
            $table->enum('categoria', ['finta', 'drible', 'remate', 'defesa', 'táctica'])
                ->default('táctica');
            $table->timestamp('data_upload')->useCurrent();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('dicas');
    }
};
