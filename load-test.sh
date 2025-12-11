#!/bin/bash
# ================================
# Script de Test de Charge
# ================================
# Génère du trafic pour observer les métriques

echo "🚀 Démarrage du test de charge..."
echo "📊 Les métriques seront visibles dans Grafana : http://localhost:3001"
echo ""

# Compteur
REQUEST_COUNT=0
ERROR_COUNT=0

# Fonction pour afficher la progression
show_progress() {
    echo -ne "\r✅ Requêtes: $REQUEST_COUNT | ❌ Erreurs: $ERROR_COUNT"
}

# Boucle principale
for i in {1..200}; do
    # 70% de requêtes normales
    if [ $((RANDOM % 10)) -lt 7 ]; then
        curl -s http://localhost:3000/ > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            ((REQUEST_COUNT++))
        fi
    fi
    
    # 20% de health checks
    if [ $((RANDOM % 10)) -lt 2 ]; then
        curl -s http://localhost:3000/health > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            ((REQUEST_COUNT++))
        fi
    fi
    
    # 5% d'erreurs 404
    if [ $((RANDOM % 20)) -eq 0 ]; then
        curl -s http://localhost:3000/not-found > /dev/null 2>&1
        ((REQUEST_COUNT++))
        ((ERROR_COUNT++))
    fi
    
    # 5% d'erreurs 500
    if [ $((RANDOM % 20)) -eq 0 ]; then
        curl -s http://localhost:3000/error > /dev/null 2>&1
        ((REQUEST_COUNT++))
        ((ERROR_COUNT++))
    fi
    
    show_progress
    
    # Pause aléatoire pour simuler du trafic réaliste
    sleep 0.$((RANDOM % 3))
done

echo ""
echo ""
echo "✅ Test terminé !"
echo "📈 Requêtes totales: $REQUEST_COUNT"
echo "❌ Erreurs: $ERROR_COUNT"
echo ""
echo "🎯 Maintenant, va voir les dashboards :"
echo "   - Prometheus: http://localhost:9090"
echo "   - Grafana: http://localhost:3001"
