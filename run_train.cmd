@echo off
setlocal
if exist "C:\Users\SHARAD\AppData\Local\Python\bin\python.exe" (
    "C:\Users\SHARAD\AppData\Local\Python\bin\python.exe" "%~dp0train_decision_prediction_pr1_pr11.py" %*
) else (
    python "%~dp0train_decision_prediction_pr1_pr11.py" %*
)
