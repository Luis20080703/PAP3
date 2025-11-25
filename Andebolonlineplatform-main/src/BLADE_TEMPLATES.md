# Templates Blade - Referência Completa

## 📋 Estrutura de Views

```
resources/views/
├── layouts/
│   ├── app.blade.php           # Layout principal
│   ├── guest.blade.php         # Layout para visitantes
│   └── dashboard.blade.php     # Layout do dashboard
├── components/
│   ├── button.blade.php        # Componente botão
│   ├── card.blade.php          # Componente card
│   ├── input.blade.php         # Componente input
│   └── alert.blade.php         # Componente alerta
├── livewire/
│   └── [componentes gerados automaticamente]
├── errors/
│   ├── 404.blade.php
│   └── 403.blade.php
└── welcome.blade.php           # Opcional
```

---

## 1. Layout Principal

**Ficheiro:** `resources/views/layouts/app.blade.php`

```blade
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ $title ?? 'Plataforma Andebol' }}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
    
    <!-- Styles -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- Livewire Styles -->
    @livewireStyles
</head>
<body class="antialiased">
    {{ $slot }}
    
    <!-- Livewire Scripts -->
    @livewireScripts
    
    <!-- Toast Notifications (Opcional - usar Livewire Wire UI ou similar) -->
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    @stack('scripts')
</body>
</html>
```

---

## 2. Layout Guest (Visitantes)

**Ficheiro:** `resources/views/layouts/guest.blade.php`

```blade
<x-layouts.app>
    <div class="min-h-screen bg-gray-50">
        <!-- Navigation Bar (opcional) -->
        <nav class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <a href="{{ route('home') }}" class="flex items-center gap-2">
                        <span class="text-2xl">🤾</span>
                        <span class="font-bold">Plataforma Andebol</span>
                    </a>
                    
                    <a 
                        href="{{ route('login') }}" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Entrar
                    </a>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main>
            {{ $slot }}
        </main>

        <!-- Footer -->
        <footer class="bg-white border-t mt-12">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <div class="text-center text-gray-600">
                    <p>&copy; {{ date('Y') }} Plataforma Andebol. Projeto PAP.</p>
                </div>
            </div>
        </footer>
    </div>
</x-layouts.app>
```

---

## 3. Layout Dashboard (Autenticado)

**Ficheiro:** `resources/views/layouts/dashboard.blade.php`

```blade
<x-layouts.app>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <!-- Logo -->
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🤾</span>
                        <span class="font-bold">Plataforma Andebol</span>
                    </div>
                    
                    <!-- User Info -->
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <div class="font-medium">{{ auth()->user()->name }}</div>
                            <div class="text-sm text-gray-600">
                                {{ auth()->user()->getTypeLabel() }} - {{ auth()->user()->team }}
                            </div>
                        </div>
                        
                        <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                            {{ auth()->user()->getInitials() }}
                        </div>
                        
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button 
                                type="submit" 
                                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Sair
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 py-8">
            {{ $slot }}
        </main>
    </div>
</x-layouts.app>
```

---

## 4. Componentes Blade Reutilizáveis

### Button Component

**Ficheiro:** `resources/views/components/button.blade.php`

```blade
@props([
    'variant' => 'primary',
    'size' => 'md',
    'type' => 'button',
])

@php
$baseClasses = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

$variants = [
    'primary' => 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    'secondary' => 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    'danger' => 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    'success' => 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
];

$sizes = [
    'sm' => 'px-3 py-1.5 text-sm',
    'md' => 'px-4 py-2',
    'lg' => 'px-6 py-3 text-lg',
];

$classes = $baseClasses . ' ' . $variants[$variant] . ' ' . $sizes[$size];
@endphp

<button 
    type="{{ $type }}" 
    {{ $attributes->merge(['class' => $classes]) }}
>
    {{ $slot }}
</button>
```

**Uso:**
```blade
<x-button variant="primary" size="md">Guardar</x-button>
<x-button variant="danger" wire:click="delete">Eliminar</x-button>
```

### Card Component

**Ficheiro:** `resources/views/components/card.blade.php`

```blade
@props([
    'title' => null,
    'padding' => true,
])

<div {{ $attributes->merge(['class' => 'bg-white rounded-lg shadow']) }}>
    @if($title)
        <div class="px-6 py-4 border-b">
            <h3 class="font-semibold">{{ $title }}</h3>
        </div>
    @endif
    
    <div class="{{ $padding ? 'p-6' : '' }}">
        {{ $slot }}
    </div>
</div>
```

**Uso:**
```blade
<x-card title="Estatísticas">
    <p>Conteúdo do card...</p>
</x-card>
```

### Input Component

**Ficheiro:** `resources/views/components/input.blade.php`

```blade
@props([
    'label' => null,
    'name' => '',
    'type' => 'text',
    'placeholder' => '',
    'required' => false,
    'error' => null,
])

<div class="mb-4">
    @if($label)
        <label for="{{ $name }}" class="block mb-2 font-medium text-gray-700">
            {{ $label }}
            @if($required)
                <span class="text-red-500">*</span>
            @endif
        </label>
    @endif
    
    <input
        type="{{ $type }}"
        id="{{ $name }}"
        name="{{ $name }}"
        placeholder="{{ $placeholder }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->merge(['class' => 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ' . ($error ? 'border-red-500' : 'border-gray-300')]) }}
    />
    
    @if($error)
        <p class="mt-1 text-sm text-red-500">{{ $error }}</p>
    @endif
</div>
```

**Uso:**
```blade
<x-input 
    label="Email" 
    name="email" 
    type="email" 
    wire:model="email" 
    :error="$errors->first('email')"
    required 
/>
```

### Alert Component

**Ficheiro:** `resources/views/components/alert.blade.php`

```blade
@props([
    'type' => 'info',
])

@php
$types = [
    'success' => 'bg-green-50 text-green-800 border-green-200',
    'error' => 'bg-red-50 text-red-800 border-red-200',
    'warning' => 'bg-yellow-50 text-yellow-800 border-yellow-200',
    'info' => 'bg-blue-50 text-blue-800 border-blue-200',
];

$icons = [
    'success' => '✓',
    'error' => '✕',
    'warning' => '⚠',
    'info' => 'ℹ',
];
@endphp

<div {{ $attributes->merge(['class' => 'p-4 border rounded-lg ' . $types[$type]]) }}>
    <div class="flex items-start gap-3">
        <span class="text-xl">{{ $icons[$type] }}</span>
        <div class="flex-1">
            {{ $slot }}
        </div>
    </div>
</div>
```

**Uso:**
```blade
<x-alert type="success">Jogada criada com sucesso!</x-alert>
<x-alert type="error">Ocorreu um erro ao guardar.</x-alert>
```

### Badge Component

**Ficheiro:** `resources/views/components/badge.blade.php`

```blade
@props([
    'color' => 'gray',
])

@php
$colors = [
    'gray' => 'bg-gray-100 text-gray-800',
    'blue' => 'bg-blue-100 text-blue-800',
    'green' => 'bg-green-100 text-green-800',
    'red' => 'bg-red-100 text-red-800',
    'yellow' => 'bg-yellow-100 text-yellow-800',
];
@endphp

<span {{ $attributes->merge(['class' => 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ' . $colors[$color]]) }}>
    {{ $slot }}
</span>
```

**Uso:**
```blade
<x-badge color="blue">Contra-ataque</x-badge>
<x-badge color="green">Seniores</x-badge>
```

---

## 5. Exemplo de View Completa

**Ficheiro:** `resources/views/home.blade.php` (se não usar Livewire)

```blade
<x-layouts.guest>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h1 class="text-5xl font-bold mb-4">
                🤾 NexusHand
            </h1>
            <p class="text-xl mb-8 text-blue-100">
                A plataforma completa para atletas e treinadores de andebol em Portugal
            </p>
            <a href="{{ route('login') }}" class="inline-block">
                <x-button variant="primary" size="lg">
                    Entrar na Plataforma
                </x-button>
            </a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <x-card>
                    <div class="text-center">
                        <div class="text-4xl mb-4">📹</div>
                        <h3 class="font-semibold mb-2">Jogadas</h3>
                        <p class="text-gray-600">
                            Partilha e aprende com jogadas táticas de andebol
                        </p>
                    </div>
                </x-card>

                <x-card>
                    <div class="text-center">
                        <div class="text-4xl mb-4">💡</div>
                        <h3 class="font-semibold mb-2">Dicas Técnicas</h3>
                        <p class="text-gray-600">
                            Melhora as tuas habilidades com dicas de especialistas
                        </p>
                    </div>
                </x-card>

                <x-card>
                    <div class="text-center">
                        <div class="text-4xl mb-4">📊</div>
                        <h3 class="font-semibold mb-2">Estatísticas</h3>
                        <p class="text-gray-600">
                            Acompanha o desempenho de equipas e atletas
                        </p>
                    </div>
                </x-card>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="bg-gray-100 py-16">
        <div class="max-w-7xl mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-4">Sobre a Plataforma</h2>
                <p class="text-lg text-gray-700 mb-4">
                    Esta plataforma foi desenvolvida como projeto PAP para apoiar atletas 
                    e treinadores de andebol na sua evolução desportiva através da tecnologia.
                </p>
                <p class="text-gray-600">
                    Regista-te agora e junta-te à comunidade de andebol portuguesa!
                </p>
            </div>
        </div>
    </section>
</x-layouts.guest>
```

---

## 6. Flash Messages

**Ficheiro:** `resources/views/components/flash-messages.blade.php`

```blade
@if (session('success'))
    <x-alert type="success" class="mb-4">
        {{ session('success') }}
    </x-alert>
@endif

@if (session('error'))
    <x-alert type="error" class="mb-4">
        {{ session('error') }}
    </x-alert>
@endif

@if (session('warning'))
    <x-alert type="warning" class="mb-4">
        {{ session('warning') }}
    </x-alert>
@endif

@if (session('info'))
    <x-alert type="info" class="mb-4">
        {{ session('info') }}
    </x-alert>
@endif
```

**Uso nos layouts:**
```blade
<main>
    <x-flash-messages />
    {{ $slot }}
</main>
```

---

## 7. Paginação Personalizada

**Ficheiro:** `resources/views/vendor/pagination/tailwind.blade.php`

```bash
# Publicar views de paginação
php artisan vendor:publish --tag=laravel-pagination
```

Depois editar o ficheiro gerado para usar Tailwind CSS.

**Uso:**
```blade
{{ $plays->links() }}
```

---

## 8. Tailwind CSS Configuration

**Ficheiro:** `resources/css/app.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Typography Personalizada */
@layer base {
    h1 {
        @apply text-4xl font-bold;
    }
    
    h2 {
        @apply text-3xl font-bold;
    }
    
    h3 {
        @apply text-2xl font-semibold;
    }
    
    h4 {
        @apply text-xl font-semibold;
    }
    
    p {
        @apply text-base text-gray-700;
    }
    
    a {
        @apply text-blue-600 hover:text-blue-800 transition-colors;
    }
}

/* Componentes Customizados */
@layer components {
    .btn {
        @apply px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
    }
    
    .btn-primary {
        @apply btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
    }
    
    .btn-secondary {
        @apply btn bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
    }
    
    .input {
        @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    }
    
    .card {
        @apply bg-white rounded-lg shadow p-6;
    }
}

/* Animações */
@layer utilities {
    .fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
```

---

## 9. JavaScript (Alpine.js ou Livewire Wire UI)

**Ficheiro:** `resources/js/app.js`

```javascript
import './bootstrap';

// Alpine.js (opcional, para interações simples)
import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();

// Confirmações de eliminação
window.confirmDelete = function(message) {
    return confirm(message || 'Tens a certeza?');
};

// Toast notifications (com SweetAlert2)
window.toast = function(type, message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
};
```

---

## ✅ Checklist de Templates

- [ ] Criar layout principal (`app.blade.php`)
- [ ] Criar layout guest (`guest.blade.php`)
- [ ] Criar layout dashboard (`dashboard.blade.php`)
- [ ] Criar componentes reutilizáveis (button, card, input, alert, badge)
- [ ] Configurar Tailwind CSS
- [ ] Criar páginas de erro (404, 403)
- [ ] Implementar flash messages
- [ ] (Opcional) Configurar Alpine.js ou Livewire Wire UI
- [ ] Publicar e customizar views de paginação

---

## 🎨 Paleta de Cores

```css
/* Cores principais (adicionar ao tailwind.config.js se necessário) */
primary: #2563eb (blue-600)
secondary: #64748b (slate-500)
success: #16a34a (green-600)
danger: #dc2626 (red-600)
warning: #ca8a04 (yellow-600)
info: #0891b2 (cyan-600)
```

---

## 🚀 Próximo Passo

Com os templates criados, podes começar a implementar os componentes Livewire seguindo o **[LIVEWIRE_COMPONENTS.md](./LIVEWIRE_COMPONENTS.md)**.

Boa sorte com o teu projeto! 🎉
