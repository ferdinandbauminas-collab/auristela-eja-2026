@echo off
echo ==========================================
echo 🚀 CONECTAR PROJETO AO GITHUB (EJA 2026)
echo ==========================================
echo.
echo 1. Certifique-se de ter criado um repositorio VAZIO no GitHub
echo    chamado: auristela-eja-2026
echo.
set /p repo_url="Cole aqui a URL do seu repositorio (ex: https://github.com/seu-usuario/auristela-eja-2026.git): "

git init
git add .
git commit -m "Initial commit: Projeto EJA 2026 Finalizado"
git branch -M main
git remote add origin %repo_url%
git push -u origin main

echo.
echo ==========================================
echo ✅ PROJETO CONECTADO COM SUCESSO!
echo ==========================================
pause
 