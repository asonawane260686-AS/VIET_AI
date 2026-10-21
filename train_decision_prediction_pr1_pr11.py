"""
================================================================================
VIETCARBON AI - DECISION PREDICTION AI MODEL TRAINING SUITE (PR1 - PR11)
Algorithms from AI/ML Practical Syllabus:
  PR1:  Intelligent Agents (Simple Reflex Agent & PEAS)
  PR2:  Uninformed Search (Breadth-First Search & Depth-First Search)
  PR3:  Informed Search (Greedy Best-First Search & A* Search)
  PR4:  Knowledge Representation (Rule-Based Expert System, Forward & Backward Chaining)
  PR5:  Regression (Linear Regression & Polynomial Regression)
  PR6:  Classification (Logistic Regression & K-Nearest Neighbors)
  PR7:  Classification (Decision Tree & Naive Bayes)
  PR8:  Clustering (K-Means & Agglomerative Hierarchical Clustering)
  PR9:  Dimensionality Reduction (Principal Component Analysis - PCA)
  PR10: Advanced Classification (Support Vector Machine, Random Forest, AdaBoost)
  PR11: Model Optimization (K-Fold Cross-Validation & Grid Search Hyperparameter Tuning)
================================================================================
"""

import sys
import os
import time
import math
from collections import deque
import heapq

# Ensure clean UTF-8 console output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, GridSearchCV
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)

# Set random seed for reproducibility
np.random.seed(42)

print("=" * 80)
print("VIETCARBON AI: DECISION PREDICTION MODEL TRAINING (SYLLABUS ALGORITHMS PR1-PR11)")
print("=" * 80)

# ==============================================================================
# 0. DATASET GENERATION BASED ON VIETNAM MUNICIPAL & CITIZEN REPOSITORY DATA
# ==============================================================================
# Grounded in backend/utils/vietnamData.js (Hanoi, HCMC, Da Nang, Hai Phong, Can Tho)
# Features: [vehicles_k, population_k, traffic_index, factories, electricity_gwh, daily_km, pm25, flood_risk, renewable_pct]

N_SAMPLES = 500

vehicles_k = np.random.uniform(200, 2200, N_SAMPLES)
population_k = np.random.uniform(800, 9800, N_SAMPLES)
traffic_index = np.random.uniform(45, 95, N_SAMPLES)
factories = np.random.uniform(250, 2200, N_SAMPLES)
electricity_gwh = np.random.uniform(150, 1800, N_SAMPLES)
daily_km = np.random.uniform(10, 45, N_SAMPLES)
pm25 = np.random.uniform(20, 180, N_SAMPLES)
flood_risk = np.random.uniform(20, 95, N_SAMPLES)
renewable_pct = np.random.uniform(10, 45, N_SAMPLES)

# Non-linear physical relationship for CO2 emission (Million Tons / yr)
co2_target = (
    0.015 * vehicles_k +
    0.002 * population_k +
    0.15 * traffic_index +
    0.008 * factories +
    0.012 * electricity_gwh +
    0.00008 * (traffic_index ** 2.2) -
    0.25 * renewable_pct +
    np.random.normal(0, 1.5, N_SAMPLES)
)
co2_target = np.clip(co2_target, 2.0, 70.0)

# Categorical Decision Target: 1 = High Alert / Exceeds Quota, 0 = Compliant / Normal
# Decision based on regulatory environmental criteria
risk_score = 0.4 * (pm25 / 180.0) + 0.3 * (traffic_index / 95.0) + 0.3 * (co2_target / 50.0)
decision_binary = (risk_score >= 0.55).astype(int)

# Multi-class Decision Level: 0=Low, 1=Moderate, 2=Severe, 3=Critical
decision_multiclass = np.select(
    [risk_score < 0.40, risk_score < 0.58, risk_score < 0.75],
    [0, 1, 2],
    default=3
)

X_df = pd.DataFrame({
    'vehicles_k': vehicles_k,
    'population_k': population_k,
    'traffic_index': traffic_index,
    'factories': factories,
    'electricity_gwh': electricity_gwh,
    'daily_km': daily_km,
    'pm25': pm25,
    'flood_risk': flood_risk,
    'renewable_pct': renewable_pct
})

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_df)

X_train, X_test, y_reg_train, y_reg_test = train_test_split(X_scaled, co2_target, test_size=0.25, random_state=42)
_, _, y_clf_train, y_clf_test = train_test_split(X_scaled, decision_binary, test_size=0.25, random_state=42)
_, _, y_multi_train, y_multi_test = train_test_split(X_scaled, decision_multiclass, test_size=0.25, random_state=42)

print(f"Dataset successfully initialized:")
print(f"  - Total records: {N_SAMPLES}")
print(f"  - Features: {list(X_df.columns)}")
print(f"  - Class distribution (Binary): Compliant (0) = {np.sum(decision_binary==0)}, High Alert (1) = {np.sum(decision_binary==1)}")
print(f"  - Class distribution (Multi-class): Low={np.sum(decision_multiclass==0)}, Mod={np.sum(decision_multiclass==1)}, Sev={np.sum(decision_multiclass==2)}, Crit={np.sum(decision_multiclass==3)}\n")

# ==============================================================================
# PR1: INTELLIGENT AGENTS (Simple Reflex Agent & PEAS Representation)
# ==============================================================================
print("-" * 80)
print("PR1: INTELLIGENT AGENTS - Simple Reflex Agent & PEAS Representation")
print("-" * 80)

class SimpleReflexEnvironmentalAgent:
    """Simple Reflex Agent mapping current environmental percepts directly to actions."""
    def __init__(self):
        self.action_history = []

    def perceive_and_act(self, percept):
        aqi = percept.get('aqi', 50)
        speed_ratio = percept.get('speed_ratio', 1.0)
        flood_level = percept.get('flood_level', 0.0)

        # Condition-Action Rules
        if flood_level >= 1.5:
            action = "DISPATCH_EMERGENCY_DRAINAGE_AND_CLOSE_ROADS"
        elif aqi >= 150 and speed_ratio < 0.4:
            action = "RESTRICT_HEAVY_TRUCKS_AND_DIVERT_TRAFFIC"
        elif aqi >= 150:
            action = "ISSUE_AIR_QUALITY_HEALTH_WARNING"
        elif speed_ratio < 0.3:
            action = "EXTEND_GREEN_LIGHT_WAVE_IN_CONGESTED_CORRIDOR"
        else:
            action = "MAINTAIN_NORMAL_MONITORING"

        self.action_history.append((percept, action))
        return action

agent = SimpleReflexEnvironmentalAgent()
test_percepts = [
    {'aqi': 165, 'speed_ratio': 0.28, 'flood_level': 0.2},
    {'aqi': 85, 'speed_ratio': 0.85, 'flood_level': 0.1},
    {'aqi': 110, 'speed_ratio': 0.35, 'flood_level': 1.8},
]

print("PEAS Description:")
print("  - Performance Measure: Maximize carbon reduction & traffic flow, zero flood casualty")
print("  - Environment: 5 Vietnamese metropolitan areas & traffic corridors")
print("  - Actuators: Traffic message signals, emergency sluice gates, public alerts")
print("  - Sensors: PM2.5 sensors, loop vehicle detectors, ultrasonic water stage gauges\n")
print("Executing Agent Decision Rules on Sample Percepts:")
for idx, p in enumerate(test_percepts, 1):
    action = agent.perceive_and_act(p)
    print(f"  Percept #{idx}: {p} --> Action: [{action}]")
print()

# ==============================================================================
# PR2: UNINFORMED SEARCH (Breadth-First Search & Depth-First Search)
# ==============================================================================
print("-" * 80)
print("PR2: UNINFORMED SEARCH - Breadth-First Search (BFS) & Depth-First Search (DFS)")
print("-" * 80)

# Vietnam Major Logistics & Green Transport Graph
vietnam_graph = {
    'Hanoi': ['Hai Phong', 'Ninh Binh'],
    'Hai Phong': ['Hanoi', 'Halong'],
    'Ninh Binh': ['Hanoi', 'Thanh Hoa'],
    'Halong': ['Hai Phong'],
    'Thanh Hoa': ['Ninh Binh', 'Vinh'],
    'Vinh': ['Thanh Hoa', 'Hue'],
    'Hue': ['Vinh', 'Da Nang'],
    'Da Nang': ['Hue', 'Quang Ngai'],
    'Quang Ngai': ['Da Nang', 'Nha Trang'],
    'Nha Trang': ['Quang Ngai', 'Phan Thiet', 'Da Lat'],
    'Da Lat': ['Nha Trang', 'Ho Chi Minh City'],
    'Phan Thiet': ['Nha Trang', 'Ho Chi Minh City'],
    'Ho Chi Minh City': ['Phan Thiet', 'Da Lat', 'Vung Tau', 'Can Tho'],
    'Vung Tau': ['Ho Chi Minh City'],
    'Can Tho': ['Ho Chi Minh City', 'Ca Mau'],
    'Ca Mau': ['Can Tho']
}

def bfs(graph, start, goal):
    start_time = time.perf_counter()
    frontier = deque([[start]])
    explored = set([start])
    nodes_explored = 0
    while frontier:
        path = frontier.popleft()
        node = path[-1]
        nodes_explored += 1
        if node == goal:
            elapsed = (time.perf_counter() - start_time) * 1000
            return path, nodes_explored, elapsed
        for neighbor in graph.get(node, []):
            if neighbor not in explored:
                explored.add(neighbor)
                frontier.append(path + [neighbor])
    return None, nodes_explored, (time.perf_counter() - start_time) * 1000

def dfs(graph, start, goal):
    start_time = time.perf_counter()
    frontier = [[start]]
    explored = set()
    nodes_explored = 0
    while frontier:
        path = frontier.pop()
        node = path[-1]
        nodes_explored += 1
        if node == goal:
            elapsed = (time.perf_counter() - start_time) * 1000
            return path, nodes_explored, elapsed
        if node not in explored:
            explored.add(node)
            for neighbor in reversed(graph.get(node, [])):
                if neighbor not in explored:
                    frontier.append(path + [neighbor])
    return None, nodes_explored, (time.perf_counter() - start_time) * 1000

start_city, goal_city = 'Hanoi', 'Can Tho'
bfs_path, bfs_nodes, bfs_time = bfs(vietnam_graph, start_city, goal_city)
dfs_path, dfs_nodes, dfs_time = dfs(vietnam_graph, start_city, goal_city)

print(f"Route Search Task: {start_city} --> {goal_city}")
print(f"  [BFS Result]:")
print(f"    - Path ({len(bfs_path)-1} hops): {' -> '.join(bfs_path)}")
print(f"    - Nodes Explored: {bfs_nodes}")
print(f"    - Execution Time: {bfs_time:.4f} ms")
print(f"  [DFS Result]:")
print(f"    - Path ({len(dfs_path)-1} hops): {' -> '.join(dfs_path)}")
print(f"    - Nodes Explored: {dfs_nodes}")
print(f"    - Execution Time: {dfs_time:.4f} ms\n")

# ==============================================================================
# PR3: INFORMED SEARCH (Greedy Best-First Search & A* Search)
# ==============================================================================
print("-" * 80)
print("PR3: INFORMED SEARCH - Greedy Best-First Search & A* Search")
print("-" * 80)

# Geographical coordinates (Latitude, Longitude) for Vietnam nodes
coords = {
    'Hanoi': (21.0285, 105.8542),
    'Hai Phong': (20.8449, 106.6881),
    'Halong': (20.9505, 107.0734),
    'Ninh Binh': (20.2539, 105.9750),
    'Thanh Hoa': (19.8067, 105.7852),
    'Vinh': (18.6734, 105.6923),
    'Hue': (16.4637, 107.5909),
    'Da Nang': (16.0544, 108.2022),
    'Quang Ngai': (15.1205, 108.7923),
    'Nha Trang': (12.2388, 109.1967),
    'Da Lat': (11.9404, 108.4583),
    'Phan Thiet': (10.9289, 108.1021),
    'Ho Chi Minh City': (10.8231, 106.6297),
    'Vung Tau': (10.3460, 107.0843),
    'Can Tho': (10.0452, 105.7469),
    'Ca Mau': (9.1769, 105.1524)
}

def haversine_km(c1, c2):
    R = 6371.0
    lat1, lon1 = math.radians(c1[0]), math.radians(c1[1])
    lat2, lon2 = math.radians(c2[0]), math.radians(c2[1])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    return 2 * R * math.asin(math.sqrt(a))

def greedy_best_first(graph, coords, start, goal):
    start_time = time.perf_counter()
    frontier = []
    heapq.heappush(frontier, (haversine_km(coords[start], coords[goal]), [start]))
    explored = set()
    nodes_explored = 0
    while frontier:
        h_val, path = heapq.heappop(frontier)
        node = path[-1]
        nodes_explored += 1
        if node == goal:
            elapsed = (time.perf_counter() - start_time) * 1000
            total_dist = sum(haversine_km(coords[path[i]], coords[path[i+1]]) for i in range(len(path)-1))
            return path, total_dist, nodes_explored, elapsed
        if node not in explored:
            explored.add(node)
            for neighbor in graph.get(node, []):
                if neighbor not in explored:
                    heapq.heappush(frontier, (haversine_km(coords[neighbor], coords[goal]), path + [neighbor]))
    return None, 0, nodes_explored, (time.perf_counter() - start_time) * 1000

def a_star(graph, coords, start, goal):
    start_time = time.perf_counter()
    frontier = []
    # (f_score, g_score, path)
    h0 = haversine_km(coords[start], coords[goal])
    heapq.heappush(frontier, (h0, 0.0, [start]))
    best_g = {start: 0.0}
    nodes_explored = 0
    while frontier:
        f_val, g_val, path = heapq.heappop(frontier)
        node = path[-1]
        nodes_explored += 1
        if node == goal:
            elapsed = (time.perf_counter() - start_time) * 1000
            return path, g_val, nodes_explored, elapsed
        for neighbor in graph.get(node, []):
            step_cost = haversine_km(coords[node], coords[neighbor])
            tentative_g = g_val + step_cost
            if neighbor not in best_g or tentative_g < best_g[neighbor]:
                best_g[neighbor] = tentative_g
                h_val = haversine_km(coords[neighbor], coords[goal])
                f_score = tentative_g + h_val
                heapq.heappush(frontier, (f_score, tentative_g, path + [neighbor]))
    return None, 0, nodes_explored, (time.perf_counter() - start_time) * 1000

gbfs_path, gbfs_dist, gbfs_nodes, gbfs_time = greedy_best_first(vietnam_graph, coords, start_city, goal_city)
astar_path, astar_dist, astar_nodes, astar_time = a_star(vietnam_graph, coords, start_city, goal_city)

print(f"Informed Routing Task: {start_city} --> {goal_city}")
print(f"  [Greedy Best-First Search]:")
print(f"    - Path: {' -> '.join(gbfs_path)}")
print(f"    - Total Path Length: {gbfs_dist:.2f} km")
print(f"    - Nodes Explored: {gbfs_nodes}")
print(f"    - Execution Time: {gbfs_time:.4f} ms")
print(f"  [A* Search (Admissible Heuristic)]: ")
print(f"    - Path: {' -> '.join(astar_path)}")
print(f"    - Total Path Length: {astar_dist:.2f} km")
print(f"    - Nodes Explored: {astar_nodes}")
print(f"    - Execution Time: {astar_time:.4f} ms\n")

# ==============================================================================
# PR4: KNOWLEDGE REPRESENTATION (Rule-Based Expert System, Forward & Backward)
# ==============================================================================
print("-" * 80)
print("PR4: KNOWLEDGE REPRESENTATION - Rule-Based Expert System (Forward & Backward Chaining)")
print("-" * 80)

expert_rules = [
    ({'PM25_ABOVE_150'}, 'UNHEALTHY_AIR'),
    ({'TRAFFIC_CONGESTION_EXTREME'}, 'HIGH_IDLE_EMISSIONS'),
    ({'UNHEALTHY_AIR', 'HIGH_IDLE_EMISSIONS'}, 'ACTIVATE_MUNICIPAL_RED_ALERT'),
    ({'ACTIVATE_MUNICIPAL_RED_ALERT'}, 'DISPATCH_ODD_EVEN_VEHICLE_RESTRICTION'),
    ({'FLOOD_STAGE_CRITICAL'}, 'FLOOD_HAZARD'),
    ({'FLOOD_HAZARD', 'UNHEALTHY_AIR'}, 'DUAL_EMERGENCY_STATE')
]

# Forward Chaining Implementation
def forward_chaining(rules, initial_facts):
    working_memory = set(initial_facts)
    fired_rules = []
    added = True
    while added:
        added = False
        for premises, conclusion in rules:
            if conclusion not in working_memory and premises.issubset(working_memory):
                working_memory.add(conclusion)
                fired_rules.append((premises, conclusion))
                added = True
    return working_memory, fired_rules

# Backward Chaining Implementation
def backward_chaining(rules, working_memory, goal, visited=None):
    if visited is None:
        visited = set()
    if goal in working_memory:
        return True, [f"Fact verified: {goal}"]
    if goal in visited:
        return False, []
    visited.add(goal)
    matching_rules = [r for r in rules if r[1] == goal]
    for premises, conclusion in matching_rules:
        all_proven = True
        subproofs = []
        for premise in premises:
            proven, p_steps = backward_chaining(rules, working_memory, premise, visited.copy())
            if not proven:
                all_proven = False
                break
            subproofs.extend(p_steps)
        if all_proven:
            subproofs.append(f"Derived {conclusion} from {premises}")
            return True, subproofs
    return False, []

observed_facts = {'PM25_ABOVE_150', 'TRAFFIC_CONGESTION_EXTREME'}
wm, fired = forward_chaining(expert_rules, observed_facts)

print(f"Forward Chaining:")
print(f"  - Initial Observed Facts: {observed_facts}")
print(f"  - Rules Fired:")
for p, c in fired:
    print(f"      IF {p} THEN {c}")
print(f"  - Final Working Memory: {wm}\n")

goal_to_prove = 'DISPATCH_ODD_EVEN_VEHICLE_RESTRICTION'
proven, proof_steps = backward_chaining(expert_rules, observed_facts, goal_to_prove)
print(f"Backward Chaining:")
print(f"  - Hypothesized Goal: [{goal_to_prove}]")
print(f"  - Proven: {proven}")
print(f"  - Reasoning Steps: {proof_steps}\n")

# ==============================================================================
# PR5: REGRESSION (Linear Regression & Polynomial Regression)
# ==============================================================================
print("-" * 80)
print("PR5: REGRESSION - Linear Regression & Polynomial Regression")
print("-" * 80)

# Linear Regression
lin_reg = LinearRegression()
lin_reg.fit(X_train, y_reg_train)
y_lin_pred = lin_reg.predict(X_test)

mse_lin = mean_squared_error(y_reg_test, y_lin_pred)
mae_lin = mean_absolute_error(y_reg_test, y_lin_pred)
r2_lin = r2_score(y_reg_test, y_lin_pred)

print("Linear Regression (Continuous Annual CO2 Target):")
print(f"  - Mean Squared Error (MSE):  {mse_lin:.4f}")
print(f"  - Mean Absolute Error (MAE): {mae_lin:.4f}")
print(f"  - R-squared (R^2):            {r2_lin:.4f}")

# Polynomial Regression (Degree 2)
poly = PolynomialFeatures(degree=2, include_bias=False)
X_train_poly = poly.fit_transform(X_train)
X_test_poly = poly.transform(X_test)

poly_reg = LinearRegression()
poly_reg.fit(X_train_poly, y_reg_train)
y_poly_pred = poly_reg.predict(X_test_poly)

mse_poly = mean_squared_error(y_reg_test, y_poly_pred)
mae_poly = mean_absolute_error(y_reg_test, y_poly_pred)
r2_poly = r2_score(y_reg_test, y_poly_pred)

print("\nPolynomial Regression (Degree = 2, Feature Dimensions = %d):" % X_train_poly.shape[1])
print(f"  - Mean Squared Error (MSE):  {mse_poly:.4f}")
print(f"  - Mean Absolute Error (MAE): {mae_poly:.4f}")
print(f"  - R-squared (R^2):            {r2_poly:.4f}\n")

# ==============================================================================
# PR6: CLASSIFICATION (Logistic Regression & K-Nearest Neighbors)
# ==============================================================================
print("-" * 80)
print("PR6: CLASSIFICATION - Logistic Regression & K-Nearest Neighbors (KNN)")
print("-" * 80)

# Logistic Regression
log_reg = LogisticRegression(random_state=42)
log_reg.fit(X_train, y_clf_train)
y_log_pred = log_reg.predict(X_test)

acc_log = accuracy_score(y_clf_test, y_log_pred)
prec_log = precision_score(y_clf_test, y_log_pred)
rec_log = recall_score(y_clf_test, y_log_pred)
f1_log = f1_score(y_clf_test, y_log_pred)
cm_log = confusion_matrix(y_clf_test, y_log_pred)

print("Logistic Regression (Binary Decision: Exceeds vs Compliant):")
print(f"  - Accuracy:  {acc_log * 100:.2f}%")
print(f"  - Precision: {prec_log * 100:.2f}%")
print(f"  - Recall:    {rec_log * 100:.2f}%")
print(f"  - F1-Score:  {f1_log:.4f}")
print(f"  - Confusion Matrix:\n{cm_log}")

# KNN Classifier (K=5)
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_clf_train)
y_knn_pred = knn.predict(X_test)

acc_knn = accuracy_score(y_clf_test, y_knn_pred)
prec_knn = precision_score(y_clf_test, y_knn_pred)
rec_knn = recall_score(y_clf_test, y_knn_pred)
f1_knn = f1_score(y_clf_test, y_knn_pred)
cm_knn = confusion_matrix(y_clf_test, y_knn_pred)

print("\nK-Nearest Neighbors (K = 5):")
print(f"  - Accuracy:  {acc_knn * 100:.2f}%")
print(f"  - Precision: {prec_knn * 100:.2f}%")
print(f"  - Recall:    {rec_knn * 100:.2f}%")
print(f"  - F1-Score:  {f1_knn:.4f}")
print(f"  - Confusion Matrix:\n{cm_knn}\n")

# ==============================================================================
# PR7: CLASSIFICATION (Decision Tree & Naive Bayes)
# ==============================================================================
print("-" * 80)
print("PR7: CLASSIFICATION - Decision Tree & Naive Bayes")
print("-" * 80)

# Decision Tree (CART)
dt = DecisionTreeClassifier(criterion='gini', max_depth=5, random_state=42)
dt.fit(X_train, y_clf_train)
y_dt_pred = dt.predict(X_test)

acc_dt = accuracy_score(y_clf_test, y_dt_pred)
prec_dt = precision_score(y_clf_test, y_dt_pred)
rec_dt = recall_score(y_clf_test, y_dt_pred)
f1_dt = f1_score(y_clf_test, y_dt_pred)
cm_dt = confusion_matrix(y_clf_test, y_dt_pred)

print("Decision Tree Classifier (Criterion = Gini Impurity, Max Depth = 5):")
print(f"  - Accuracy:  {acc_dt * 100:.2f}%")
print(f"  - Precision: {prec_dt * 100:.2f}%")
print(f"  - Recall:    {rec_dt * 100:.2f}%")
print(f"  - F1-Score:  {f1_dt:.4f}")
print(f"  - Confusion Matrix:\n{cm_dt}")

# Gaussian Naive Bayes
nb = GaussianNB()
nb.fit(X_train, y_clf_train)
y_nb_pred = nb.predict(X_test)

acc_nb = accuracy_score(y_clf_test, y_nb_pred)
prec_nb = precision_score(y_clf_test, y_nb_pred)
rec_nb = recall_score(y_clf_test, y_nb_pred)
f1_nb = f1_score(y_clf_test, y_nb_pred)
cm_nb = confusion_matrix(y_clf_test, y_nb_pred)

print("\nGaussian Naive Bayes Classifier:")
print(f"  - Accuracy:  {acc_nb * 100:.2f}%")
print(f"  - Precision: {prec_nb * 100:.2f}%")
print(f"  - Recall:    {rec_nb * 100:.2f}%")
print(f"  - F1-Score:  {f1_nb:.4f}")
print(f"  - Confusion Matrix:\n{cm_nb}\n")

# ==============================================================================
# PR8: CLUSTERING (K-Means & Hierarchical Agglomerative Clustering)
# ==============================================================================
print("-" * 80)
print("PR8: CLUSTERING - K-Means & Agglomerative Hierarchical Clustering")
print("-" * 80)

# K-Means with Elbow Method evaluation (K=2 to 6)
inertias = []
k_range = range(2, 7)
for k in k_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

print("K-Means Elbow Method (Inertia J vs. Cluster Count K):")
for k, j_val in zip(k_range, inertias):
    print(f"  K = {k}: Inertia = {j_val:.2f}")

optimal_k = 3
km_opt = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
km_labels = km_opt.fit_predict(X_scaled)
print(f"\nK-Means Cluster Sizes (K = {optimal_k}):")
for c in range(optimal_k):
    print(f"  Cluster {c}: {np.sum(km_labels == c)} profiles")

# Hierarchical Clustering (Agglomerative)
linkages = ['ward', 'complete', 'average', 'single']
print(f"\nHierarchical Agglomerative Clustering Comparison (K = {optimal_k}):")
for link in linkages:
    agg = AgglomerativeClustering(n_clusters=optimal_k, linkage=link)
    agg_labels = agg.fit_predict(X_scaled)
    counts = [int(np.sum(agg_labels == c)) for c in range(optimal_k)]
    print(f"  Linkage = {link:<8}: Cluster Distribution = {counts}")
print()

# ==============================================================================
# PR9: DIMENSIONALITY REDUCTION (Principal Component Analysis - PCA)
# ==============================================================================
print("-" * 80)
print("PR9: DIMENSIONALITY REDUCTION - Principal Component Analysis (PCA)")
print("-" * 80)

pca = PCA(n_components=None)
pca.fit(X_scaled)

eigenvalues = pca.explained_variance_
evr = pca.explained_variance_ratio_
cev = np.cumsum(evr)

print(f"PCA on {X_scaled.shape[1]} Municipal Telemetry Features:")
print(f"{'Component':<12} {'Eigenvalue':<14} {'Explained Var Ratio':<22} {'Cumulative Var':<16}")
print("-" * 65)
for i in range(len(eigenvalues)):
    print(f"PC{i+1:<10} {eigenvalues[i]:<14.4f} {evr[i]*100:<20.2f}% {cev[i]*100:<14.2f}%")

k_90 = np.argmax(cev >= 0.90) + 1
print(f"\nComponents required to capture >= 90% variance: {k_90} of {X_scaled.shape[1]}")
X_pca_k = pca.transform(X_scaled)[:, :k_90]
print(f"Reduced dataset shape: {X_pca_k.shape}\n")

# ==============================================================================
# PR10: ADVANCED CLASSIFICATION (Support Vector Machine, Random Forest, AdaBoost)
# ==============================================================================
print("-" * 80)
print("PR10: ADVANCED CLASSIFICATION - SVM, Random Forest & AdaBoost")
print("-" * 80)

# 1. Support Vector Machine (RBF Kernel)
svm = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
svm.fit(X_train, y_clf_train)
y_svm_pred = svm.predict(X_test)

acc_svm = accuracy_score(y_clf_test, y_svm_pred)
prec_svm = precision_score(y_clf_test, y_svm_pred)
rec_svm = recall_score(y_clf_test, y_svm_pred)
f1_svm = f1_score(y_clf_test, y_svm_pred)
cm_svm = confusion_matrix(y_clf_test, y_svm_pred)

print("Support Vector Machine (RBF Kernel, C = 1.0):")
print(f"  - Accuracy:  {acc_svm * 100:.2f}%")
print(f"  - Precision: {prec_svm * 100:.2f}%")
print(f"  - Recall:    {rec_svm * 100:.2f}%")
print(f"  - F1-Score:  {f1_svm:.4f}")
print(f"  - Support Vectors Count: {len(svm.support_)}")
print(f"  - Confusion Matrix:\n{cm_svm}")

# 2. Random Forest Classifier
rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
rf.fit(X_train, y_clf_train)
y_rf_pred = rf.predict(X_test)

acc_rf = accuracy_score(y_clf_test, y_rf_pred)
prec_rf = precision_score(y_clf_test, y_rf_pred)
rec_rf = recall_score(y_clf_test, y_rf_pred)
f1_rf = f1_score(y_clf_test, y_rf_pred)
cm_rf = confusion_matrix(y_clf_test, y_rf_pred)

print("\nRandom Forest (100 Trees, Max Depth = 6):")
print(f"  - Accuracy:  {acc_rf * 100:.2f}%")
print(f"  - Precision: {prec_rf * 100:.2f}%")
print(f"  - Recall:    {rec_rf * 100:.2f}%")
print(f"  - F1-Score:  {f1_rf:.4f}")
print(f"  - Confusion Matrix:\n{cm_rf}")

# 3. AdaBoost Classifier
ada = AdaBoostClassifier(n_estimators=50, random_state=42)
ada.fit(X_train, y_clf_train)
y_ada_pred = ada.predict(X_test)

acc_ada = accuracy_score(y_clf_test, y_ada_pred)
prec_ada = precision_score(y_clf_test, y_ada_pred)
rec_ada = recall_score(y_clf_test, y_ada_pred)
f1_ada = f1_score(y_clf_test, y_ada_pred)
cm_ada = confusion_matrix(y_clf_test, y_ada_pred)

print("\nAdaBoost Classifier (50 Stumps):")
print(f"  - Accuracy:  {acc_ada * 100:.2f}%")
print(f"  - Precision: {prec_ada * 100:.2f}%")
print(f"  - Recall:    {rec_ada * 100:.2f}%")
print(f"  - F1-Score:  {f1_ada:.4f}")
print(f"  - Confusion Matrix:\n{cm_ada}\n")

# ==============================================================================
# PR11: MODEL OPTIMIZATION (Cross-Validation & Grid Search)
# ==============================================================================
print("-" * 80)
print("PR11: MODEL OPTIMIZATION - K-Fold Cross-Validation & Grid Search")
print("-" * 80)

# 1. 5-Fold Cross-Validation on Random Forest
kf = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = []
for fold, (train_idx, val_idx) in enumerate(kf.split(X_scaled), 1):
    X_f_tr, y_f_tr = X_scaled[train_idx], decision_binary[train_idx]
    X_f_val, y_f_val = X_scaled[val_idx], decision_binary[val_idx]
    clf_k = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    clf_k.fit(X_f_tr, y_f_tr)
    pred_val = clf_k.predict(X_f_val)
    fold_acc = accuracy_score(y_f_val, pred_val)
    cv_scores.append(fold_acc)
    print(f"  Fold {fold} Accuracy: {fold_acc * 100:.2f}%")

print(f"\n5-Fold Cross-Validation Summary (Random Forest):")
print(f"  - Mean Accuracy: {np.mean(cv_scores) * 100:.2f}%")
print(f"  - Standard Deviation: {np.std(cv_scores) * 100:.2f}%")

# 2. Grid Search Hyperparameter Tuning for Support Vector Machine
param_grid = {
    'C': [0.1, 1.0, 10.0],
    'gamma': ['scale', 'auto', 0.01, 0.1],
    'kernel': ['rbf']
}

grid_search = GridSearchCV(
    estimator=SVC(random_state=42),
    param_grid=param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=1
)
grid_search.fit(X_train, y_clf_train)

print(f"\nGrid Search Hyperparameter Tuning (Support Vector Machine):")
print(f"  - Total Parameter Combinations Evaluated: {len(grid_search.cv_results_['params'])}")
print(f"  - Best Hyperparameters: {grid_search.best_params_}")
print(f"  - Best 5-Fold CV Accuracy: {grid_search.best_score_ * 100:.2f}%")

# Test Best Estimator on Test Set
best_svm = grid_search.best_estimator_
y_best_pred = best_svm.predict(X_test)
print(f"  - Tuned Model Test Accuracy: {accuracy_score(y_clf_test, y_best_pred) * 100:.2f}%")
print(f"  - Tuned Model Test F1-Score: {f1_score(y_clf_test, y_best_pred):.4f}")

print("\n" + "=" * 80)
print("TRAINING AND EVALUATION COMPLETE FOR ALL SYLLABUS ALGORITHMS (PR1-PR11)")
print("=" * 80)

