/**
 * VIETCARBON AI — Syllabus Algorithms (PR1 - PR11)
 * Algorithms strictly mapped according to their intended syllabus purpose:
 *  - Regression: Predict numerical outcomes
 *  - Classification: Predict categories and decisions
 *  - Clustering: Discover patterns and group similar records
 *  - PCA: Reduce feature dimensions where appropriate
 *  - Search (BFS, DFS, Greedy Best-First, A*): Graph-based decision or route-search tasks
 *  - Rule-Based (Forward/Backward Chaining): Explainable decisions
 *  - Model Optimization (Cross-Validation, Grid Search): Optimize supported ML models
 *  - Intelligent Agent: Select actions based on environment, percepts and performance measures
 */

export const SYLLABUS_ALGORITHMS = {
  // PR1: Intelligent Agents
  'pr1_simple_reflex': {
    id: 'pr1_simple_reflex',
    practical: 'PR1',
    name: 'Simple Reflex Agent & PEAS Representation',
    shortName: 'Simple Reflex Agent',
    category: 'Intelligent Agents',
    purpose: 'Use an intelligent agent to select actions based on the environment, available information and defined performance measures.',
    decisionObjective: 'Real-time condition-action decision rules mapping current environmental sensor inputs directly to actuator actions without internal history.',
    targetVariable: 'Operational Intervention Action (e.g., RESTRICT_HEAVY_TRUCKS, DISPATCH_DRAINAGE, MAINTAIN_MONITORING)',
    peas: {
      performanceMeasure: 'Maximize CO2 reduction, minimize traffic congestion delay, maintain zero flood casualties.',
      environment: '5 Vietnamese metropolitan regions (Hanoi, HCMC, Da Nang, Hai Phong, Can Tho), urban corridors, and canal drainage networks.',
      actuators: 'Variable message signs, emergency sluice gate controllers, public environmental alert broadcasts, green corridor signal timers.',
      sensors: 'Inductive loop vehicle detectors, PM2.5 particulate monitors, ultrasonic water stage gauges, smart electricity meters.'
    },
    keyFormulas: [
      'A_t = f(P_t)  -- Mapping instantaneous percept vector P_t to action A_t',
      'Action(P_t) = a_i  if  C_i(P_t) == True  else  a_default',
      'Utility U = SUM_{t=1}^T [ w1 * DeltaCO2(t) - w2 * Delay(t) - w3 * Cost(t) ]'
    ],
    pseudocode: `ALGORITHM SimpleReflexEnvironmentalAgent(percept):
    INPUT: percept = { aqi, speed_ratio, flood_level }
    STEPS:
        1. IF flood_level >= 1.5 THEN RETURN "DISPATCH_EMERGENCY_DRAINAGE_AND_CLOSE_ROADS"
        2. IF aqi >= 150 AND speed_ratio < 0.4 THEN RETURN "RESTRICT_HEAVY_TRUCKS_AND_DIVERT_TRAFFIC"
        3. IF aqi >= 150 THEN RETURN "ISSUE_AIR_QUALITY_HEALTH_WARNING"
        4. IF speed_ratio < 0.3 THEN RETURN "EXTEND_GREEN_LIGHT_WAVE_IN_CONGESTED_CORRIDOR"
        5. RETURN "MAINTAIN_NORMAL_MONITORING"
    OUTPUT: Selected immediate actuator action`,
    trainingAlgorithm: {
      name: 'Deterministic Condition-Action Rule Engine with PEAS Policy Optimization',
      category: 'Percept-Action Reflex Control',
      efficiencyRationale: 'Zero-state latency (sub-millisecond evaluation) ensuring real-time fail-safe protection across smart city grid actuators.',
      hyperparameters: { responseTime: '0.005 ms', ruleBaseSize: 5, stateHistory: 'Memoryless (Current Percept Only)' }
    },
    measuredResults: {
      latency: '0.005 ms',
      ruleCoverage: '100% Deterministic',
      utilityScore: '+88.4 Net Sustainability Utility',
      sampleOutputs: [
        { percept: 'AQI=165, SpeedRatio=0.28, Flood=0.2m', action: 'RESTRICT_HEAVY_TRUCKS_AND_DIVERT_TRAFFIC' },
        { percept: 'AQI=85, SpeedRatio=0.85, Flood=0.1m', action: 'MAINTAIN_NORMAL_MONITORING' },
        { percept: 'AQI=110, SpeedRatio=0.35, Flood=1.8m', action: 'DISPATCH_EMERGENCY_DRAINAGE_AND_CLOSE_ROADS' }
      ]
    }
  },

  // PR2: Uninformed Search
  'pr2_bfs': {
    id: 'pr2_bfs',
    practical: 'PR2',
    name: 'Breadth-First Search (BFS)',
    shortName: 'BFS Route Search',
    category: 'Uninformed Search',
    purpose: 'Use BFS for suitable graph-based decision or route-search tasks.',
    decisionObjective: 'Find the minimum-hop routing corridor for municipal green logistics or emergency equipment dispatch across unweighted Vietnam regional nodes.',
    targetVariable: 'Minimum-Hop Evacuation / Logistics Route',
    keyFormulas: [
      'Q_{t+1} = Enqueue(Q_t, Neighbors(u) \\ (Visited U Q_t))  -- FIFO frontier queue',
      'd(v) = d(u) + 1  -- Layer-wise step cost across uniform edges',
      'L* = min_{pi in Pi(s, g)} |pi|  -- Shallowest goal discovery guarantee'
    ],
    pseudocode: `ALGORITHM BreadthFirstSearch(Graph G, start_node, goal_node):
    INPUT: G = (V, E), start_node, goal_node
    STEPS:
        1. frontier = FIFOQueue(); ENQUEUE(frontier, [start_node])
        2. explored = Set([start_node])
        3. WHILE frontier IS NOT EMPTY DO:
               path = DEQUEUE(frontier); current = path.last()
               IF current == goal_node THEN RETURN path
               FOR neighbor IN G.Neighbors(current) DO:
                   IF neighbor NOT IN explored THEN:
                       ADD neighbor TO explored
                       ENQUEUE(frontier, path + [neighbor])
        4. RETURN Failure
    OUTPUT: Shallowest path sequence`,
    trainingAlgorithm: {
      name: 'FIFO Layer-by-Layer Tree Expansion',
      category: 'Uninformed Systematic Search',
      efficiencyRationale: 'Guarantees the optimal minimum-hop solution without requiring prior edge weights or heuristic domain models.',
      hyperparameters: { frontierQueue: 'FIFO', completeness: 'Guaranteed', optimality: 'Optimal for unweighted' }
    },
    measuredResults: {
      testTask: 'Hanoi -> Can Tho (Vietnam Logistics Graph)',
      hops: 10,
      path: 'Hanoi -> Ninh Binh -> Thanh Hoa -> Vinh -> Hue -> Da Nang -> Quang Ngai -> Nha Trang -> Phan Thiet -> HCMC -> Can Tho',
      nodesExplored: 15,
      executionTime: '0.0120 ms'
    }
  },

  'pr2_dfs': {
    id: 'pr2_dfs',
    practical: 'PR2',
    name: 'Depth-First Search (DFS)',
    shortName: 'DFS Network Isolation',
    category: 'Uninformed Search',
    purpose: 'Use DFS for suitable graph-based decision or route-search tasks.',
    decisionObjective: 'Deep branch verification for municipal power grid islanding, topological reachability, and drainage network loop detection.',
    targetVariable: 'Topological Reachability Path & Cycle Detection',
    keyFormulas: [
      'S_{t+1} = Push(S_t, Neighbors(u) \\ Visited)  -- LIFO frontier stack',
      'depth(v) = depth(u) + 1  -- Recursive traversal depth',
      'Space Complexity = O(b * m), Time Complexity = O(b^m)'
    ],
    pseudocode: `ALGORITHM DepthFirstSearch(Graph G, start_node, goal_node):
    INPUT: G = (V, E), start, goal
    STEPS:
        1. frontier = LIFOStack(); PUSH(frontier, [start])
        2. explored = Set()
        3. WHILE frontier IS NOT EMPTY DO:
               path = POP(frontier); current = path.last()
               IF current == goal_node THEN RETURN path
               IF current NOT IN explored THEN:
                   ADD current TO explored
                   FOR neighbor IN REVERSE(G.Neighbors(current)) DO:
                       IF neighbor NOT IN explored THEN:
                           PUSH(frontier, path + [neighbor])
        4. RETURN Failure
    OUTPUT: Reachable path sequence`,
    trainingAlgorithm: {
      name: 'LIFO Deep-Branch Traversal',
      category: 'Uninformed Search',
      efficiencyRationale: 'Consumes minimal linear memory O(b * m) when exploring deep tree connectivity.',
      hyperparameters: { frontierStack: 'LIFO', memoryFootprint: 'Linear O(b*m)' }
    },
    measuredResults: {
      testTask: 'Hanoi -> Can Tho (Vietnam Logistics Graph)',
      hops: 10,
      path: 'Hanoi -> Ninh Binh -> Thanh Hoa -> Vinh -> Hue -> Da Nang -> Quang Ngai -> Nha Trang -> Phan Thiet -> HCMC -> Can Tho',
      nodesExplored: 15,
      executionTime: '0.0100 ms'
    }
  },

  // PR3: Informed Search
  'pr3_greedy_bfs': {
    id: 'pr3_greedy_bfs',
    practical: 'PR3',
    name: 'Greedy Best-First Search',
    shortName: 'Greedy Best-First Search',
    category: 'Informed Search',
    purpose: 'Use Greedy Best First Search for suitable graph-based decision or route-search tasks.',
    decisionObjective: 'Rapid heuristic-guided routing prioritizing corridors with minimal remaining spatial distance to destination.',
    targetVariable: 'Fast Evacuation Route (Heuristic Guided)',
    keyFormulas: [
      'f(n) = h(n)  -- Evaluation function guided purely by heuristic estimate',
      'h(n) = Haversine(Coord(n), Coord(goal))  -- Great-circle spatial distance',
      'n* = argmin_{n in Frontier} h(n)  -- Priority queue extraction'
    ],
    pseudocode: `ALGORITHM GreedyBestFirstSearch(G, coords, start, goal):
    INPUT: Graph G, coordinates, start, goal
    STEPS:
        1. open_set = PriorityQueue(ordered by h(n) ASC)
        2. INSERT(open_set, start, priority = h(start, goal))
        3. explored = Set()
        4. WHILE open_set IS NOT EMPTY DO:
               current = EXTRACT_MIN(open_set)
               IF current == goal THEN RETURN ReconstructedPath
               ADD current TO explored
               FOR neighbor IN G.Neighbors(current) DO:
                   IF neighbor NOT IN explored THEN:
                       INSERT(open_set, neighbor, priority = h(neighbor, goal))
        5. RETURN Failure
    OUTPUT: Heuristic-guided path`,
    trainingAlgorithm: {
      name: 'Min-Heap Priority Queue on Heuristic Distances',
      category: 'Informed Greedy Search',
      efficiencyRationale: 'Dramatically cuts node expansions by directing exploration toward the target destination.',
      hyperparameters: { heuristic: 'Haversine Great-Circle', tieBreaking: 'Arbitrary' }
    },
    measuredResults: {
      testTask: 'Hanoi -> Can Tho (Spatial Route)',
      pathLengthKm: '1588.16 km',
      path: 'Hanoi -> Ninh Binh -> Thanh Hoa -> Vinh -> Hue -> Da Nang -> Quang Ngai -> Nha Trang -> Phan Thiet -> HCMC -> Can Tho',
      nodesExplored: 11,
      executionTime: '0.0331 ms'
    }
  },

  'pr3_a_star': {
    id: 'pr3_a_star',
    practical: 'PR3',
    name: 'A* Search Algorithm',
    shortName: 'A* Green Corridor Search',
    category: 'Informed Search',
    purpose: 'Use A* for suitable graph-based decision or route-search tasks.',
    decisionObjective: 'Provably optimal, lowest-carbon path finding combining actual incurred travel cost with an admissible heuristic.',
    targetVariable: 'Optimal Cost / Minimal Carbon Route',
    keyFormulas: [
      'f(n) = g(n) + h(n)  -- Total estimated path cost',
      'g(n) = g(parent) + cost(parent, n)  -- Exact path cost from start',
      'h(n) <= cost(n, n\') + h(n\')  -- Consistency and admissibility condition'
    ],
    pseudocode: `ALGORITHM AStarSearch(G, coords, start, goal):
    INPUT: Graph G, coords, edge_costs, start, goal
    STEPS:
        1. open_set = PriorityQueue(ordered by f(n) ASC)
        2. g_score[start] = 0; f_score[start] = h(start, goal)
        3. INSERT(open_set, start, priority = f_score[start])
        4. WHILE open_set IS NOT EMPTY DO:
               current = EXTRACT_MIN(open_set)
               IF current == goal THEN RETURN ReconstructPath(current)
               FOR (neighbor, step_cost) IN G.Edges(current) DO:
                   tentative_g = g_score[current] + step_cost
                   IF tentative_g < g_score[neighbor] THEN:
                       g_score[neighbor] = tentative_g
                       f_score[neighbor] = tentative_g + h(neighbor, goal)
                       UPDATE_OR_INSERT(open_set, neighbor, f_score[neighbor])
        5. RETURN Failure
    OUTPUT: Mathematically optimal lowest-cost path`,
    trainingAlgorithm: {
      name: 'Admissible A* Graph Traversal with Consistent Heuristic',
      category: 'Informed Optimal Search',
      efficiencyRationale: 'Explores only nodes whose lower-bound total cost is less than the optimal path cost L*, guaranteeing minimum search effort for optimal routes.',
      hyperparameters: { heuristic: 'Haversine (Admissible, Underestimating)', optimality: 'Guaranteed' }
    },
    measuredResults: {
      testTask: 'Hanoi -> Can Tho (Optimal Route)',
      pathLengthKm: '1560.47 km',
      path: 'Hanoi -> Ninh Binh -> Thanh Hoa -> Vinh -> Hue -> Da Nang -> Quang Ngai -> Nha Trang -> Da Lat -> HCMC -> Can Tho',
      nodesExplored: 13,
      executionTime: '0.0443 ms'
    }
  },

  // PR4: Knowledge Representation
  'pr4_rule_expert': {
    id: 'pr4_rule_expert',
    practical: 'PR4',
    name: 'Rule-Based Expert System (Logical Implication)',
    shortName: 'Rule-Based Expert System',
    category: 'Knowledge Representation',
    purpose: 'Use rule-based reasoning for explainable decisions.',
    decisionObjective: 'Transparent regulatory policy verification using Modus Ponens implication to declare statutory environmental alerts.',
    targetVariable: 'Explainable Policy Decision (e.g., ODD_EVEN_VEHICLE_RESTRICTION)',
    keyFormulas: [
      '(P -> Q) ^ P |= Q  -- Modus Ponens logical inference',
      '(Premise_1 ^ Premise_2 ^ ... ^ Premise_m) => Conclusion',
      'CF(H, E1 ^ E2) = min(CF(H, E1), CF(H, E2))  -- Certainty factor metric'
    ],
    pseudocode: `ALGORITHM RuleBasedExpertEvaluator(FactBase, RuleBase):
    INPUT: FactBase = { "PM25_ABOVE_150", "TRAFFIC_CONGESTION_EXTREME" }
           RuleBase = list of (premises, conclusion)
    STEPS:
        1. triggered = Set()
        2. FOR EACH (premises, conclusion) IN RuleBase DO:
               IF premises IS_SUBSET_OF FactBase THEN:
                   ADD conclusion TO triggered
        3. RETURN triggered
    OUTPUT: Deterministic explainable decisions`,
    trainingAlgorithm: {
      name: 'Deductive Production Rule Inference Engine',
      category: 'Symbolic AI / Knowledge Systems',
      efficiencyRationale: 'Complete logical traceability with zero black-box opacity for municipal environmental auditing.',
      hyperparameters: { logicMode: 'First-Order Modus Ponens', certaintyMetric: 'Bounded [-1, 1]' }
    },
    measuredResults: {
      initialFacts: 'PM25_ABOVE_150, TRAFFIC_CONGESTION_EXTREME',
      rulesFired: 4,
      conclusion: 'ACTIVATE_MUNICIPAL_RED_ALERT -> DISPATCH_ODD_EVEN_VEHICLE_RESTRICTION',
      explainabilityScore: '100% Fully Traceable Proof Tree'
    }
  },

  'pr4_forward_chaining': {
    id: 'pr4_forward_chaining',
    practical: 'PR4',
    name: 'Forward Chaining Inference',
    shortName: 'Forward Chaining',
    category: 'Knowledge Representation',
    purpose: 'Use Forward Chaining for explainable decisions.',
    decisionObjective: 'Data-driven bottom-up inference starting from newly measured sensor facts to deduce all reachable operational conclusions.',
    targetVariable: 'All Deduced Environmental States & Actions',
    keyFormulas: [
      'WM_{k+1} = WM_k U { RHS(r) | LHS(r) <= WM_k, r in R \\ Fired }',
      'Termination Condition: WM_{k+1} == WM_k  (Fixpoint reached)'
    ],
    pseudocode: `ALGORITHM ForwardChaining(KnowledgeBase, WorkingMemory):
    INPUT: KnowledgeBase rules, initial observed WorkingMemory facts
    STEPS:
        1. fired = Set()
        2. LOOP:
               changed = FALSE
               FOR EACH rule IN KnowledgeBase DO:
                   IF rule NOT IN fired AND rule.premises <= WorkingMemory THEN:
                       WorkingMemory = WorkingMemory U { rule.conclusion }
                       ADD rule TO fired; changed = TRUE
               IF changed == FALSE THEN BREAK
        3. RETURN WorkingMemory
    OUTPUT: Full closure set of derived facts`,
    trainingAlgorithm: {
      name: 'Monotonic Bottom-Up Working Memory Expander',
      category: 'Inference Mechanism',
      efficiencyRationale: 'Evaluates once per state change without backtrack overhead, suitable for high-throughput sensor telemetry streaming.',
      hyperparameters: { inferenceDirection: 'Data-Driven (Antecedent -> Consequent)' }
    },
    measuredResults: {
      rulesFiredCount: 4,
      finalDerivedFacts: 'UNHEALTHY_AIR, HIGH_IDLE_EMISSIONS, ACTIVATE_MUNICIPAL_RED_ALERT, DISPATCH_ODD_EVEN_VEHICLE_RESTRICTION',
      latency: '0.008 ms'
    }
  },

  'pr4_backward_chaining': {
    id: 'pr4_backward_chaining',
    practical: 'PR4',
    name: 'Backward Chaining Inference',
    shortName: 'Backward Chaining',
    category: 'Knowledge Representation',
    purpose: 'Use Backward Chaining for explainable decisions.',
    decisionObjective: 'Goal-driven top-down hypothesis verification to determine if sensor facts substantiate a specific emergency decree.',
    targetVariable: 'Hypothesis Verification Proof (True / False)',
    keyFormulas: [
      'Prove(G) = True if G in WM else OR_{r in R_G} ( AND_{p in LHS(r)} Prove(p) )',
      'R_G = { r in R | RHS(r) == G }  -- Candidate rules having G as consequent'
    ],
    pseudocode: `ALGORITHM BackwardChaining(goal, WorkingMemory, KnowledgeBase):
    FUNCTION PROVE(target, visited):
        IF target IN WorkingMemory THEN RETURN TRUE
        IF target IN visited THEN RETURN FALSE  // Cycle prevention
        visited.add(target)
        FOR EACH rule IN KnowledgeBase WHERE rule.conclusion == target DO:
            IF ALL(PROVE(premise, COPY(visited)) FOR premise IN rule.premises) THEN:
                WorkingMemory.add(target)
                RETURN TRUE
        RETURN FALSE
    RETURN PROVE(goal, Set())`,
    trainingAlgorithm: {
      name: 'Recursive Goal-Reduction AND/OR Tree Search',
      category: 'Inference Mechanism',
      efficiencyRationale: 'Avoids expanding irrelevant branches by focusing computation only on premises linked to the requested hypothesis.',
      hyperparameters: { searchOrder: 'Depth-First Subgoal Reduction', cycleDetection: 'Visited Set' }
    },
    measuredResults: {
      hypothesizedGoal: 'DISPATCH_ODD_EVEN_VEHICLE_RESTRICTION',
      provenStatus: 'TRUE',
      proofDepth: 3,
      reasoningPath: 'Sensor Facts -> High Emissions + Unhealthy Air -> Red Alert -> Odd/Even Restriction'
    }
  },

  // PR5: Regression
  'pr5_linear_regression': {
    id: 'pr5_linear_regression',
    practical: 'PR5',
    name: 'Linear Regression (Ordinary Least Squares)',
    shortName: 'Linear Regression',
    category: 'Regression',
    purpose: 'Use regression algorithms to predict numerical outcomes.',
    decisionObjective: 'Predict continuous numerical annual carbon emissions (Million Tons CO2) from citizen vehicle fleets, commute distance, and power usage.',
    targetVariable: 'Continuous Annual CO2 Emissions (MT/yr)',
    keyFormulas: [
      'y = beta_0 + SUM_{i=1}^n beta_i * x_i = x^T * beta',
      'Loss J(beta) = (1 / 2m) * SUM_{i=1}^m (h_beta(x^(i)) - y^(i))^2',
      'Normal Equation: beta = (X^T * X)^(-1) * X^T * y'
    ],
    pseudocode: `ALGORITHM LinearRegressionOLS(X, y):
    INPUT: Feature matrix X (m x n), continuous target vector y (m x 1)
    STEPS:
        1. X_b = CONCATENATE([ones(m, 1), X])
        2. beta = INVERSE(TRANSPOSE(X_b) * X_b) * TRANSPOSE(X_b) * y
        3. predictions = X_b * beta
        4. MSE = (1 / m) * SUM((y - predictions)^2)
        5. R2 = 1 - (SUM((y - predictions)^2) / SUM((y - MEAN(y))^2))
        6. RETURN (beta, MSE, R2)
    OUTPUT: Coefficient vector beta, evaluation metrics`,
    trainingAlgorithm: {
      name: 'Ordinary Least Squares (OLS) Closed-Form Matrix Inversion',
      category: 'Parametric Linear Regression',
      efficiencyRationale: 'Deterministic global analytical solution avoiding iterative gradient step tuning for smooth convex loss.',
      hyperparameters: { solver: 'Normal Equation (SVD fallback)', intercept: true, regularization: 'None (Unbiased OLS)' }
    },
    measuredResults: {
      mse: 5.1022,
      mae: 1.7562,
      r2Score: 0.9605,
      accuracyPct: '96.05% Variance Explained (R²)'
    }
  },

  'pr5_poly_regression': {
    id: 'pr5_poly_regression',
    practical: 'PR5',
    name: 'Polynomial Regression (Degree = 2)',
    shortName: 'Polynomial Regression',
    category: 'Regression',
    purpose: 'Use regression algorithms to predict numerical outcomes.',
    decisionObjective: 'Capture quadratic and non-linear interactions in emission rates under severe traffic congestion and vehicle idling.',
    targetVariable: 'Non-Linear Annual CO2 Emissions (MT/yr)',
    keyFormulas: [
      'y = beta_0 + SUM_{j=1}^d beta_j * x^j  -- Univariate expansion',
      'phi(x) = [1, x_1, ..., x_n, x_1^2, x_1*x_2, ..., x_n^2]^T  -- Degree-2 feature map',
      'beta = (Phi^T * Phi)^(-1) * Phi^T * y'
    ],
    pseudocode: `ALGORITHM PolynomialRegression(X, y, degree=2):
    INPUT: Feature matrix X (m x n), target y, degree d
    STEPS:
        1. Phi = POLYNOMIAL_FEATURE_EXPANSION(X, degree=2)  // Expands to 54 dimensions
        2. beta = INVERSE(TRANSPOSE(Phi) * Phi) * TRANSPOSE(Phi) * y
        3. y_pred = Phi * beta
        4. MSE = (1 / m) * SUM((y - y_pred)^2)
        5. RETURN (beta, MSE, R2_SCORE(y, y_pred))
    OUTPUT: Polynomial coefficients, MSE, R²`,
    trainingAlgorithm: {
      name: 'Non-Linear Basis Expansion + OLS Parameter Estimation',
      category: 'Polynomial Feature Mapping',
      efficiencyRationale: 'Models quadratic idling penalties without moving to opaque neural architectures.',
      hyperparameters: { degree: 2, featureDimensions: 54, includeBias: false }
    },
    measuredResults: {
      mse: 5.2450,
      mae: 1.9487,
      r2Score: 0.9594,
      expandedFeatures: 54
    }
  },

  // PR6: Classification
  'pr6_logistic_regression': {
    id: 'pr6_logistic_regression',
    practical: 'PR6',
    name: 'Logistic Regression (Binary Decision)',
    shortName: 'Logistic Regression',
    category: 'Classification',
    purpose: 'Use classification algorithms to predict categories and decisions.',
    decisionObjective: 'Predict statutory environmental quota decisions: whether a city/district exceeds allowable carbon limits (1 = High Alert / Exceeds, 0 = Compliant).',
    targetVariable: 'Binary Regulatory Compliance Decision (0 vs 1)',
    keyFormulas: [
      'P(y=1 | x) = sigma(z) = 1 / (1 + e^(-z))  -- Sigmoid activation',
      'z = beta_0 + SUM_{i=1}^n beta_i * x_i = w^T * x + b',
      'Loss L(w, b) = - (1/m) * SUM [ y^(i)*ln(sigma(z)) + (1 - y^(i))*ln(1 - sigma(z)) ]'
    ],
    pseudocode: `ALGORITHM LogisticRegressionTrain(X, y, alpha, epochs):
    INPUT: Scaled design matrix X, binary labels y in {0, 1}
    STEPS:
        1. w = zeros(n, 1); b = 0
        2. FOR epoch FROM 1 TO epochs DO:
               z = X * w + b; p = 1 / (1 + EXP(-z))
               dw = (1 / m) * (TRANSPOSE(X) * (p - y))
               db = (1 / m) * SUM(p - y)
               w = w - alpha * dw; b = b - alpha * db
        3. y_pred = (p >= 0.5).astype(int)
        4. RETURN (w, b, ACCURACY(y, y_pred), CONFUSION_MATRIX(y, y_pred))
    OUTPUT: Learned weights, bias, classification metrics`,
    trainingAlgorithm: {
      name: 'L-BFGS Quasi-Newton Convex Optimization with Cross-Entropy Loss',
      category: 'Generalized Linear Model (GLM)',
      efficiencyRationale: 'Fast second-order curvature approximation guarantees smooth monotonic convergence on convex log-likelihood.',
      hyperparameters: { solver: 'lbfgs', maxIter: 100, penalty: 'l2', C: 1.0 }
    },
    measuredResults: {
      accuracy: '99.20%',
      precision: '99.16%',
      recall: '100.00%',
      f1Score: 0.9958,
      confusionMatrix: [[6, 1], [0, 118]]
    }
  },

  'pr6_knn': {
    id: 'pr6_knn',
    practical: 'PR6',
    name: 'K-Nearest Neighbors (KNN)',
    shortName: 'KNN Classifier',
    category: 'Classification',
    purpose: 'Use classification algorithms to predict categories and decisions.',
    decisionObjective: 'Classify urban citizen consumption severity by finding the majority vote among the K most similar historical telemetry records.',
    targetVariable: 'Citizen / Zone Carbon Intensity Class',
    keyFormulas: [
      'd(x, x_i) = SQRT( SUM_{j=1}^n (x_j - x_{ij})^2 )  -- Euclidean distance',
      'y_hat = argmax_{c in C} SUM_{i in N_K(x)} I(y_i == c)  -- Majority vote rule'
    ],
    pseudocode: `ALGORITHM KNNPredict(X_train, y_train, x_query, K=5):
    INPUT: Training database (X_train, y_train), query profile x_query, K
    STEPS:
        1. distances = []
        2. FOR i FROM 1 TO LENGTH(X_train) DO:
               dist = SQRT(SUM((x_query - X_train[i])^2))
               distances.append((dist, y_train[i]))
        3. SORT distances by dist ASCENDING
        4. k_neighbors = distances[0 : K]
        5. predicted_class = MODE([label FOR (dist, label) IN k_neighbors])
        6. RETURN predicted_class
    OUTPUT: Majority voted decision category`,
    trainingAlgorithm: {
      name: 'KD-Tree / Ball-Tree Non-Parametric Metric Indexing',
      category: 'Instance-Based Lazy Learner',
      efficiencyRationale: 'Requires zero explicit offline training time; adapts immediately as new sensor records are logged.',
      hyperparameters: { nNeighbors: 5, metric: 'euclidean', weights: 'uniform' }
    },
    measuredResults: {
      accuracy: '97.60%',
      precision: '97.52%',
      recall: '100.00%',
      f1Score: 0.9874,
      confusionMatrix: [[4, 3], [0, 118]]
    }
  },

  // PR7: Classification
  'pr7_decision_tree': {
    id: 'pr7_decision_tree',
    practical: 'PR7',
    name: 'Decision Tree Classifier (CART / Gini)',
    shortName: 'Decision Tree (CART)',
    category: 'Classification',
    purpose: 'Use classification algorithms to predict categories and decisions.',
    decisionObjective: 'Recursive binary feature partitioning to generate human-readable, auditable threshold rules for municipal traffic interventions.',
    targetVariable: 'Intervention Severity Category',
    keyFormulas: [
      'Gini(S) = 1 - SUM_{c in C} p_c^2  -- Gini Impurity metric',
      'Entropy H(S) = - SUM_{c in C} p_c * log2(p_c)',
      'DeltaGini = Gini(S) - [ (|S_L|/|S|)*Gini(S_L) + (|S_R|/|S|)*Gini(S_R) ]'
    ],
    pseudocode: `ALGORITHM BuildCARTTree(S, max_depth=5):
    INPUT: Dataset S, max_depth
    STEPS:
        1. IF ALL instances same class OR max_depth == 0 THEN RETURN Leaf(MAJORITY(S))
        2. best_gain = -INF; best_split = NULL
        3. FOR EACH feature f DO:
               FOR EACH threshold t IN S[f] DO:
                   (S_L, S_R) = PARTITION(S, f, t)
                   gain = GINI_GAIN(S, S_L, S_R)
                   IF gain > best_gain THEN best_gain = gain; best_split = (f, t, S_L, S_R)
        4. left = BuildCARTTree(best_split.S_L, max_depth - 1)
        5. right = BuildCARTTree(best_split.S_R, max_depth - 1)
        6. RETURN Node(feature=best_split.f, threshold=best_split.t, left, right)
    OUTPUT: Binary decision tree`,
    trainingAlgorithm: {
      name: 'Recursive Greedy Gini Impurity Minimization (CART)',
      category: 'Tree-Based Partitioning',
      efficiencyRationale: 'Generates transparent if-then decision thresholds with O(log N) inference time.',
      hyperparameters: { criterion: 'gini', maxDepth: 5, minSamplesSplit: 2 }
    },
    measuredResults: {
      accuracy: '92.80%',
      precision: '95.80%',
      recall: '96.61%',
      f1Score: 0.9620,
      confusionMatrix: [[2, 5], [4, 114]]
    }
  },

  'pr7_naive_bayes': {
    id: 'pr7_naive_bayes',
    practical: 'PR7',
    name: 'Gaussian Naive Bayes Classifier',
    shortName: 'Gaussian Naive Bayes',
    category: 'Classification',
    purpose: 'Use classification algorithms to predict categories and decisions.',
    decisionObjective: 'Multi-class probabilistic categorization of environmental hazard likelihood under conditional feature independence assumptions.',
    targetVariable: 'Risk Category Posterior Probability',
    keyFormulas: [
      'P(C_k | X) proportional P(C_k) * PROD_{i=1}^n P(x_i | C_k)',
      'P(x_i | C_k) = [ 1 / SQRT(2*pi*sigma_{ik}^2) ] * EXP( - (x_i - mu_{ik})^2 / (2*sigma_{ik}^2) )',
      'y_hat = argmax_k [ ln P(C_k) + SUM_{i=1}^n ln P(x_i | C_k) ]'
    ],
    pseudocode: `ALGORITHM GaussianNaiveBayes(X_train, y_train, x_query):
    INPUT: Training dataset (X, y), query x_query
    STEPS:
        1. FOR EACH class c DO:
               prior[c] = COUNT(y == c) / LENGTH(y)
               FOR EACH feature j DO:
                   mean[c, j] = MEAN(X[y == c, j])
                   var[c, j] = VARIANCE(X[y == c, j]) + epsilon
        2. FOR EACH class c DO:
               log_posterior[c] = LN(prior[c])
               FOR EACH feature j DO:
                   log_posterior[c] += GAUSSIAN_LOG_PDF(x_query[j], mean[c, j], var[c, j])
        3. RETURN argmax_c(log_posterior[c])
    OUTPUT: Maximum A Posteriori (MAP) class`,
    trainingAlgorithm: {
      name: 'Decoupled Univariate Maximum Likelihood Estimation',
      category: 'Probabilistic Generative Classifier',
      efficiencyRationale: 'Closed-form mean and variance calculation runs in a single O(N * D) pass, immune to overfitting on sparse telemetry.',
      hyperparameters: { varSmoothing: '1e-9', priorEstimation: 'Empirical' }
    },
    measuredResults: {
      accuracy: '98.40%',
      precision: '98.33%',
      recall: '100.00%',
      f1Score: 0.9916,
      confusionMatrix: [[5, 2], [0, 118]]
    }
  },

  // PR8: Clustering
  'pr8_kmeans': {
    id: 'pr8_kmeans',
    practical: 'PR8',
    name: 'K-Means Clustering (Elbow Method)',
    shortName: 'K-Means Clustering',
    category: 'Clustering',
    purpose: 'Use clustering algorithms to discover patterns and group similar records.',
    decisionObjective: 'Partition municipal urban zones or citizen records into K distinct clusters with homogeneous environmental impact profiles.',
    targetVariable: 'Unsupervised Cluster Archetype Assignment',
    keyFormulas: [
      'Inertia J = SUM_{k=1}^K SUM_{x_i in C_k} ||x_i - mu_k||^2',
      'Assignment: c_i^(t) = argmin_k ||x_i - mu_k^(t)||^2',
      'Update: mu_k^(t+1) = (1 / |C_k|) * SUM_{x_i in C_k} x_i'
    ],
    pseudocode: `ALGORITHM KMeansClustering(X, K, max_iter=100):
    INPUT: Scaled data matrix X (m x n), number of clusters K
    STEPS:
        1. Initialize centroids mu_1, ..., mu_K randomly from X
        2. FOR iter FROM 1 TO max_iter DO:
               clusters = {1: [], ..., K: []}
               FOR EACH x IN X DO:
                   k_best = argmin_k(||x - mu_k||^2)
                   clusters[k_best].append(x)
               new_centroids = [ MEAN(clusters[k], axis=0) FOR k IN (1..K) ]
               IF MAX_DIFF(centroids, new_centroids) < 1e-4 THEN BREAK
               centroids = new_centroids
        3. Inertia = SUM_{k=1}^K SUM_{x in clusters[k]} ||x - mu_k||^2
        4. RETURN (clusters, centroids, Inertia)
    OUTPUT: Cluster assignments, centroids, inertia`,
    trainingAlgorithm: {
      name: "Lloyd's Alternating Expectation-Maximization Algorithm",
      category: 'Partitional Clustering',
      efficiencyRationale: 'Linear time complexity O(N * K * D * I) scaling seamlessly across millions of smart meter logs.',
      hyperparameters: { nClusters: 3, nInit: 10, maxIter: 300, randomState: 42 }
    },
    measuredResults: {
      optimalK: 3,
      elbowInertias: [
        { K: 2, inertia: 4092.48 },
        { K: 3, inertia: 3811.58 },
        { K: 4, inertia: 3594.13 },
        { K: 5, inertia: 3433.75 },
        { K: 6, inertia: 3288.12 }
      ],
      clusterSizes: { 'Cluster 0 (Eco-Friendly / Low)': 185, 'Cluster 1 (Moderate Urban)': 155, 'Cluster 2 (Heavy Industrial)': 160 }
    }
  },

  'pr8_hierarchical': {
    id: 'pr8_hierarchical',
    practical: 'PR8',
    name: 'Agglomerative Hierarchical Clustering',
    shortName: 'Hierarchical Clustering',
    category: 'Clustering',
    purpose: 'Use clustering algorithms to discover patterns and group similar records.',
    decisionObjective: 'Construct a multi-level dendrogram tree of administrative wards to discover natural nested regional clusters.',
    targetVariable: 'Hierarchical Dendrogram Sub-tree Groupings',
    keyFormulas: [
      'Ward Linkage: DeltaESS_AB = ( |A|*|B| / (|A| + |B|) ) * ||mu_A - mu_B||^2',
      'Complete Linkage: D_complete(A, B) = max_{x in A, y in B} ||x - y||_2',
      'Single Linkage: D_single(A, B) = min_{x in A, y in B} ||x - y||_2'
    ],
    pseudocode: `ALGORITHM AgglomerativeClustering(X, target_k=3, linkage="ward"):
    INPUT: Data X, target_k clusters, linkage criterion
    STEPS:
        1. clusters = [ {x_i} FOR EACH x_i IN X ]  // m initial singleton clusters
        2. D = PAIRWISE_DISTANCE_MATRIX(clusters)
        3. WHILE LENGTH(clusters) > target_k DO:
               (A, B) = FIND_MINIMUM_PAIR(D, linkage)
               new_cluster = UNION(A, B)
               REMOVE A, B FROM clusters; APPEND new_cluster TO clusters
               UPDATE_DISTANCE_MATRIX(D, new_cluster, linkage)
        4. RETURN clusters
    OUTPUT: Nested hierarchy and cut cluster assignments`,
    trainingAlgorithm: {
      name: 'Bottom-Up Agglomerative Matrix Merging',
      category: 'Hierarchical Clustering',
      efficiencyRationale: 'Produces full multi-resolution dendrogram without pre-committing to a fixed K upfront.',
      hyperparameters: { linkage: 'ward', nClusters: 3, metric: 'euclidean' }
    },
    measuredResults: {
      optimalK: 3,
      linkageComparison: {
        'Ward': [174, 201, 125],
        'Complete': [182, 179, 139],
        'Average': [493, 1, 6],
        'Single': [498, 1, 1]
      }
    }
  },

  // PR9: Dimensionality Reduction
  'pr9_pca': {
    id: 'pr9_pca',
    practical: 'PR9',
    name: 'Principal Component Analysis (PCA)',
    shortName: 'PCA Reduction',
    category: 'Dimensionality Reduction',
    purpose: 'Use PCA to reduce feature dimensions where appropriate.',
    decisionObjective: 'Compress high-dimensional correlated sensor telemetry (weather, air quality, traffic, power) into orthogonal components while retaining >= 90% variance.',
    targetVariable: 'Orthogonal Low-Dimensional Projection Z',
    keyFormulas: [
      'Covariance Matrix: Sigma = (1 / (m - 1)) * X_tilde^T * X_tilde',
      'Eigenvalue Decomposition: Sigma * v_i = lambda_i * v_i',
      'Projection: Z = X_tilde * W_k,  where W_k = [v_1, ..., v_k]',
      'Explained Variance Ratio EVR_i = lambda_i / (SUM lambda_j)',
      'Cumulative Variance CEV_k = (SUM_{i=1}^k lambda_i) / (SUM lambda_j)'
    ],
    pseudocode: `ALGORITHM PrincipalComponentAnalysis(X, k_components):
    INPUT: Dataset X (m x n), target k
    STEPS:
        1. X_centered = X - MEAN(X, axis=0)
        2. Sigma = (1 / (m - 1)) * (TRANSPOSE(X_centered) * X_centered)
        3. (eigenvalues, eigenvectors) = EIGEN_DECOMPOSITION(Sigma)
        4. SORT eigenvalues and eigenvectors DESCENDING
        5. W_k = eigenvectors[:, 0 : k]
        6. Z = X_centered * W_k
        7. EVR = eigenvalues / SUM(eigenvalues)
        8. RETURN (Z, W_k, EVR, CUMSUM(EVR))
    OUTPUT: Reduced coordinates Z, projection matrix W_k, variance ratios`,
    trainingAlgorithm: {
      name: 'Singular Value Decomposition (SVD) of Covariance Matrix',
      category: 'Unsupervised Linear Dimensionality Reduction',
      efficiencyRationale: 'Eliminates multicollinearity and noise while preserving 90%+ variance in a compact subspace.',
      hyperparameters: { svdSolver: 'full', whiten: false }
    },
    measuredResults: {
      originalDimensions: 9,
      componentsFor90Pct: 8,
      cumulativeVariance90: '90.71%',
      topComponents: [
        { pc: 'PC1', eigenvalue: 1.1932, evr: '13.23%', cev: '13.23%' },
        { pc: 'PC2', eigenvalue: 1.1258, evr: '12.48%', cev: '25.72%' },
        { pc: 'PC3', eigenvalue: 1.0648, evr: '11.81%', cev: '37.52%' },
        { pc: 'PC4', eigenvalue: 1.0471, evr: '11.61%', cev: '49.13%' },
        { pc: 'PC5', eigenvalue: 0.9918, evr: '11.00%', cev: '60.13%' },
        { pc: 'PC6', eigenvalue: 0.9704, evr: '10.76%', cev: '70.89%' },
        { pc: 'PC7', eigenvalue: 0.9184, evr: '10.18%', cev: '81.08%' },
        { pc: 'PC8', eigenvalue: 0.8685, evr: '9.63%', cev: '90.71%' }
      ]
    }
  },

  // PR10: Advanced Classification
  'pr10_svm': {
    id: 'pr10_svm',
    practical: 'PR10',
    name: 'Support Vector Machine (SVM with RBF Kernel)',
    shortName: 'SVM Classifier',
    category: 'Advanced Classification',
    purpose: 'Use classification algorithms to predict categories and decisions.',
    decisionObjective: 'Construct an optimal maximum-margin hyperplane in RKHS reproducing kernel Hilbert space to reliably flag severe environmental hazards.',
    targetVariable: 'Maximum-Margin Decision Boundary (Severe vs Compliant)',
    keyFormulas: [
      'Dual: max_alpha SUM alpha_i - 0.5 * SUM alpha_i * alpha_j * y_i * y_j * K(x_i, x_j)',
      'RBF Kernel: K(x_i, x_j) = exp( - gamma * ||x_i - x_j||^2 )',
      'Decision Function: f(x) = sign( SUM_{i in SV} alpha_i * y_i * K(x_i, x) + b )'
    ],
    pseudocode: `ALGORITHM SVMPredict(support_vectors, alphas, y_sv, bias, gamma, x_query):
    INPUT: SV set, alpha weights, labels y_sv, bias b, kernel parameter gamma, query x
    STEPS:
        1. decision_sum = 0
        2. FOR i FROM 1 TO LENGTH(support_vectors) DO:
               k_val = EXP( - gamma * SUM((support_vectors[i] - x_query)^2) )
               decision_sum += alphas[i] * y_sv[i] * k_val
        3. decision_value = decision_sum + bias
        4. RETURN SIGN(decision_value)  // +1 or -1
    OUTPUT: Maximum-margin classification label`,
    trainingAlgorithm: {
      name: 'Sequential Minimal Optimization (SMO) for Convex Quadratic Programming',
      category: 'Kernelized Maximum-Margin Optimization',
      efficiencyRationale: 'Breaks large QP problem into 2-variable analytical sub-problems, converging in O(N^2) without global Hessian inversion.',
      hyperparameters: { kernel: 'rbf', C: 1.0, gamma: 'scale', probability: false }
    },
    measuredResults: {
      accuracy: '98.40%',
      precision: '98.33%',
      recall: '100.00%',
      f1Score: 0.9916,
      supportVectorsCount: 65,
      confusionMatrix: [[5, 2], [0, 118]]
    }
  },

  'pr10_random_forest': {
    id: 'pr10_random_forest',
    practical: 'PR10',
    name: 'Random Forest Classifier',
    shortName: 'Random Forest',
    category: 'Advanced Classification',
    purpose: 'Use classification algorithms to predict categories and decisions.',
    decisionObjective: 'Ensemble of decorrelated decision trees using bagging and random feature subspaces to prevent individual tree overfitting.',
    targetVariable: 'Ensemble Majority Vote Category',
    keyFormulas: [
      'Bootstrap Sample: D_b ~ UniformWithReplacement(D), |D_b| = m',
      'Random Feature Subspace: m_try = floor( SQRT(n) )',
      'Ensemble Vote: y_hat = argmax_{c in C} (1/B) * SUM_{b=1}^B I(T_b(x) == c)'
    ],
    pseudocode: `ALGORITHM RandomForestTrain(D, B=100, max_depth=6):
    INPUT: Dataset D, number of trees B, max_depth
    STEPS:
        1. forest = []
        2. FOR b FROM 1 TO B DO:
               D_b = BOOTSTRAP_SAMPLE(D)  // Sample m records with replacement
               tree = BUILD_RANDOM_TREE(D_b, max_depth, m_try = SQRT(n))
               forest.append(tree)
        3. RETURN forest

ALGORITHM RandomForestPredict(forest, x_query):
    1. votes = [ tree.PREDICT(x_query) FOR tree IN forest ]
    2. RETURN MAJORITY_CLASS(votes)`,
    trainingAlgorithm: {
      name: 'Bootstrap Aggregating (Bagging) + Random Feature Subspace Splitting',
      category: 'Ensemble Learning (Bagging)',
      efficiencyRationale: 'Reduces variance without increasing bias by averaging across decorrelated estimators.',
      hyperparameters: { nEstimators: 100, maxDepth: 6, randomState: 42 }
    },
    measuredResults: {
      accuracy: '95.20%',
      precision: '95.16%',
      recall: '100.00%',
      f1Score: 0.9752,
      treesTrained: 100,
      confusionMatrix: [[1, 6], [0, 118]]
    }
  },

  'pr10_adaboost': {
    id: 'pr10_adaboost',
    practical: 'PR10',
    name: 'AdaBoost Classifier (Adaptive Boosting)',
    shortName: 'AdaBoost Classifier',
    category: 'Advanced Classification',
    purpose: 'Use classification algorithms to predict categories and decisions.',
    decisionObjective: 'Sequentially boost weak decision stumps by reweighting misclassified samples, focusing on edge-case environmental violations.',
    targetVariable: 'Weighted Ensemble Decision H(x)',
    keyFormulas: [
      'w_i^(1) = 1 / m  -- Initial uniform weights',
      'Weighted Error: epsilon_t = SUM w_i^(t) * I(y_i != h_t(x_i))',
      'Learner Weight: alpha_t = 0.5 * ln( (1 - epsilon_t) / epsilon_t )',
      'Weight Update: w_i^(t+1) = (w_i^(t) / Z_t) * exp( - alpha_t * y_i * h_t(x_i) )',
      'Final Classifier: H(x) = sign( SUM_{t=1}^T alpha_t * h_t(x) )'
    ],
    pseudocode: `ALGORITHM AdaBoostTrain(X, y, T=50):
    INPUT: Scaled X, labels y in {-1, +1}, rounds T
    STEPS:
        1. w = [1/m, ..., 1/m]; learners = []; alphas = []
        2. FOR t FROM 1 TO T DO:
               h_t = FIT_DECISION_STUMP(X, y, weights = w)
               pred = h_t.PREDICT(X)
               err_t = SUM(w[i] FOR i WHERE pred[i] != y[i])
               IF err_t >= 0.5 THEN BREAK
               alpha_t = 0.5 * LN((1 - err_t) / (err_t + 1e-10))
               FOR i FROM 1 TO m DO:
                   w[i] = w[i] * EXP(-alpha_t * y[i] * pred[i])
               w = w / SUM(w)
               learners.append(h_t); alphas.append(alpha_t)
        3. RETURN (learners, alphas)`,
    trainingAlgorithm: {
      name: 'Sequential Exponential Loss Minimization',
      category: 'Ensemble Learning (Boosting)',
      efficiencyRationale: 'Directs computational effort to difficult boundary cases that standard single classifiers fail to separate.',
      hyperparameters: { nEstimators: 50, learningRate: 1.0, algorithm: 'SAMME' }
    },
    measuredResults: {
      accuracy: '97.60%',
      precision: '97.52%',
      recall: '100.00%',
      f1Score: 0.9874,
      stumpsBoosted: 50,
      confusionMatrix: [[4, 3], [0, 118]]
    }
  },

  // PR11: Model Optimization
  'pr11_cross_validation': {
    id: 'pr11_cross_validation',
    practical: 'PR11',
    name: 'K-Fold Cross-Validation (K = 5)',
    shortName: '5-Fold Cross-Validation',
    category: 'Model Optimization',
    purpose: 'Use cross-validation to optimize the supported machine learning models.',
    decisionObjective: 'Assess generalization performance, prevent overfitting, and ensure model stability across non-overlapping partitions of historical data.',
    targetVariable: 'Mean CV Accuracy & Variance Across Folds',
    keyFormulas: [
      'D = UNION_{k=1}^K D_k,  where D_i INTERSECT D_j = empty (i != j)',
      'Fold Error: E_k = Metric( f_{(-k)}, D_k )',
      'Mean Score: CV_bar = (1 / K) * SUM_{k=1}^K E_k',
      'Variance: sigma_{CV}^2 = (1 / (K - 1)) * SUM_{k=1}^K (E_k - CV_bar)^2'
    ],
    pseudocode: `ALGORITHM KFoldCrossValidation(D, ModelTrainer, Metric, K=5):
    INPUT: Dataset D = (X, y), Model, Metric, K=5
    STEPS:
        1. folds = PARTITION_INTO_K_PARTS(SHUFFLE(D), K)
        2. scores = []
        3. FOR k FROM 1 TO K DO:
               D_val = folds[k]; D_train = ALL_FOLDS_EXCEPT(folds, k)
               model_k = ModelTrainer.FIT(D_train.X, D_train.y)
               pred = model_k.PREDICT(D_val.X)
               score_k = Metric(D_val.y, pred)
               scores.append(score_k)
        4. mean_cv = MEAN(scores); std_cv = STD_DEV(scores)
        5. RETURN (mean_cv, std_cv, scores)`,
    trainingAlgorithm: {
      name: 'Non-Overlapping Fold Partitioning and Out-of-Sample Validation',
      category: 'Model Resampling & Validation',
      efficiencyRationale: 'Uses 100% of data for both training and validation without holding out single static test sets.',
      hyperparameters: { nSplits: 5, shuffle: true, randomState: 42 }
    },
    measuredResults: {
      kFolds: 5,
      foldScores: [
        { fold: 1, accuracy: '97.00%' },
        { fold: 2, accuracy: '90.00%' },
        { fold: 3, accuracy: '95.00%' },
        { fold: 4, accuracy: '97.00%' },
        { fold: 5, accuracy: '94.00%' }
      ],
      meanAccuracy: '94.60%',
      standardDeviation: '2.58%'
    }
  },

  'pr11_grid_search': {
    id: 'pr11_grid_search',
    practical: 'PR11',
    name: 'Grid Search Hyperparameter Tuning',
    shortName: 'Grid Search Tuning',
    category: 'Model Optimization',
    purpose: 'Use Grid Search to optimize the supported machine learning models.',
    decisionObjective: 'Exhaustive systematic search over Cartesian product parameter space to discover the globally optimal configuration for SVM / Random Forest.',
    targetVariable: 'Optimal Hyperparameter Tuple (theta*)',
    keyFormulas: [
      'Theta = Theta_1 x Theta_2 x ... x Theta_P  -- Cartesian product space',
      'theta* = argmax_{theta in Theta} CV_bar( A(theta), D )',
      'M* = A(theta*, D_train)  -- Final refitted production model'
    ],
    pseudocode: `ALGORITHM GridSearchHyperparameterTuning(D, ModelClass, ParamGrid, K=5):
    INPUT: Dataset D, ModelClass, ParamGrid = { C: [0.1, 1, 10], gamma: [...] }
    STEPS:
        1. candidates = CARTESIAN_PRODUCT(ParamGrid.values())
        2. best_score = -INF; best_theta = NULL
        3. FOR EACH theta IN candidates DO:
               cv_score = KFoldCV(D, ModelClass(theta), K=5)
               IF cv_score > best_score THEN:
                   best_score = cv_score; best_theta = theta
        4. final_model = ModelClass(best_theta).FIT(D.X, D.y)
        5. RETURN (best_theta, best_score, final_model)
    OUTPUT: Globally best hyperparameter combination, tuned model`,
    trainingAlgorithm: {
      name: 'Exhaustive Cartesian Product Evaluation with Internal 5-Fold CV',
      category: 'Hyperparameter Optimization',
      efficiencyRationale: 'Guarantees finding the optimum within the discrete candidate grid without stochastic variance.',
      hyperparameters: { cvFolds: 5, scoring: 'accuracy', totalCombinations: 12 }
    },
    measuredResults: {
      testedModel: 'Support Vector Machine (SVC)',
      totalCombinationsEvaluated: 12,
      bestHyperparameters: { C: 10.0, gamma: 0.01, kernel: 'rbf' },
      best5FoldCVAccuracy: '97.33%',
      tunedModelTestAccuracy: '99.20%',
      tunedModelTestF1: 0.9958
    }
  }
};

/**
 * Helper to group syllabus algorithms by their functional purpose
 */
export const ALGORITHM_CATEGORIES = [
  { id: 'all', label: 'All Syllabus Algorithms (PR1 - PR11)' },
  { id: 'Regression', label: 'Regression (Predict Numerical Outcomes)' },
  { id: 'Classification', label: 'Classification (Predict Categories & Decisions)' },
  { id: 'Advanced Classification', label: 'Advanced Classification (Ensemble & Max-Margin)' },
  { id: 'Clustering', label: 'Clustering (Discover Patterns & Group Records)' },
  { id: 'Dimensionality Reduction', label: 'Dimensionality Reduction (PCA Feature Compression)' },
  { id: 'Informed Search', label: 'Informed Search (A* & Greedy Best-First)' },
  { id: 'Uninformed Search', label: 'Uninformed Search (BFS & DFS Routing)' },
  { id: 'Knowledge Representation', label: 'Knowledge Representation (Forward & Backward Chaining)' },
  { id: 'Model Optimization', label: 'Model Optimization (Cross-Validation & Grid Search)' },
  { id: 'Intelligent Agents', label: 'Intelligent Agents (Simple Reflex Agent & PEAS)' }
];
