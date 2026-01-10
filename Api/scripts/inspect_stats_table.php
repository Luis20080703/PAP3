<?php
$path = __DIR__ . '/../database/database.sqlite';
$pdo = new PDO('sqlite:' . $path);
// Schema
$stmt = $pdo->query("PRAGMA table_info('estatistica_atletas')");
$schema = $stmt->fetchAll(PDO::FETCH_ASSOC);
// Sample rows
$stmt2 = $pdo->query("SELECT * FROM estatistica_atletas ORDER BY id DESC LIMIT 10");
$rows = $stmt2->fetchAll(PDO::FETCH_ASSOC);
$result = [
    'schema' => $schema,
    'rows' => $rows
];
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
