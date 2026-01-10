<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1) Adiciona a coluna 'validado'
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'validado')) {
                $table->boolean('validado')->default(false)->after('tipo'); // por defeito false
            }

            // torna equipa nullable (se já existir e for NOT NULL)
            if (Schema::hasColumn('users', 'equipa')) {
                $table->string('equipa')->nullable()->change();
            }
        });

        // 2) Acrescentar a opção 'root' ao enum 'tipo'
        // Atenção: comandos diferentes consoante o tipo de BD.
        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver");

        if ($driver === 'mysql') {
            // Para MySQL: altera o tipo da coluna para incluir 'root'
            DB::statement("ALTER TABLE `users` MODIFY `tipo` ENUM('atleta','treinador','root') NOT NULL DEFAULT 'atleta'");
        } elseif ($driver === 'pgsql') {
            // Para Postgres: cria novo tipo e altera coluna
            DB::statement("DO \$\$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_user_enum') THEN
                    CREATE TYPE tipo_user_enum AS ENUM ('atleta','treinador','root');
                END IF;
            END \$\$;");

            // Se a coluna já for enum antigo, é mais complexo; tentar usar USING CAST
            DB::statement("ALTER TABLE users ALTER COLUMN tipo TYPE tipo_user_enum USING tipo::text::tipo_user_enum;");
        } else {
            // SQLite (ou outros) — fallback: criar coluna temporária e copiar
            // Criamos coluna nova 'tipo_novo', copiamos valores e removemos antiga
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'tipo_novo')) {
                    $table->string('tipo_novo')->nullable()->after('tipo');
                }
            });

            // Copiar valores (root terá de ser configurado via seeder)
            DB::statement("UPDATE users SET tipo_novo = tipo");

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('tipo');
            });

            Schema::table('users', function (Blueprint $table) {
                $table->string('tipo')->default('atleta')->after('password');
            });

            DB::statement("UPDATE users SET tipo = tipo_novo");
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('tipo_novo');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'validado')) {
                $table->dropColumn('validado');
            }
            // não revertemos o enum por segurança — reverte manualmente se precisares
        });
    }
};
