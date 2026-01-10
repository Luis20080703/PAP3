import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> equipas = [];
  Map<String, dynamic> estatisticas = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      
      final equipasData = await apiService.getEquipas();
      final estatisticasData = await apiService.getEstatisticasEquipas();
      
      setState(() {
        equipas = equipasData;
        estatisticas = estatisticasData;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar dados: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Andebol Platform'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              Provider.of<AuthService>(context, listen: false).logout();
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Equipas',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  SizedBox(height: 16),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: equipas.length,
                    itemBuilder: (context, index) {
                      final equipa = equipas[index];
                      return Card(
                        child: ListTile(
                          title: Text(equipa['nome'] ?? 'Equipa ${index + 1}'),
                          subtitle: Text('ID: ${equipa['id']}'),
                        ),
                      );
                    },
                  ),
                  SizedBox(height: 24),
                  Text(
                    'Estatísticas',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Text(
                        estatisticas.isNotEmpty
                            ? estatisticas.toString()
                            : 'Nenhuma estatística disponível',
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}