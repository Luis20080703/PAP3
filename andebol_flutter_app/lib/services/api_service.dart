import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://127.0.0.1:8000/api';
  
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(userData),
    );
    return jsonDecode(response.body);
  }

  Future<List<dynamic>> getEquipas() async {
    final response = await http.get(Uri.parse('$baseUrl/equipas'));
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> getEstatisticasEquipas() async {
    final response = await http.get(Uri.parse('$baseUrl/estatisticas-equipas'));
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> getEstatisticasAtletas() async {
    final response = await http.get(Uri.parse('$baseUrl/estatisticas-atletas'));
    return jsonDecode(response.body);
  }
}