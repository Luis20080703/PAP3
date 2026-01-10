SELECT 
    e.id as estatistica_id,
    e.atleta_id,
    e.golos_marcados,
    a.id as atleta_real_id,
    a.user_id,
    u.nome,
    u.email
FROM estatistica_atletas e
LEFT JOIN atletas a ON e.atleta_id = a.id
LEFT JOIN users u ON a.user_id = u.id
WHERE e.id = 5;
