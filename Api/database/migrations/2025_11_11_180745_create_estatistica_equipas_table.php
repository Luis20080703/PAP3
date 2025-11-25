    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        public function up()
        {
            Schema::create('estatistica_equipas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('equipa_id')->constrained()->onDelete('cascade');
                $table->string('escalao');
                $table->integer('golos_marcados')->default(0);
                $table->integer('golos_sofridos')->default(0);
                $table->integer('total_golos_marcados')->default(0);
                $table->integer('total_golos_sofridos')->default(0);
                $table->float('media_golos_marcados')->default(0);
                $table->float('media_golos_sofridos')->default(0);
                $table->timestamps();
            });
        }

        public function down()
        {
            Schema::dropIfExists('estatistica_equipas');
        }
    };
