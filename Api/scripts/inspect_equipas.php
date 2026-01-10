<?php
$path = __DIR__ . '/../database/database.sqlite';
$pdo = new PDO('sqlite:' . $path);
$stmt = $pdo->query("PRAGMA table_info('equipas')");
$schema = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
