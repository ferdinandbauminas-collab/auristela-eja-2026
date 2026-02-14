@echo off
echo ==========================================
echo 🚀 ENVIAR ATUALIZACAO PARA O GITHUB
echo ==========================================
echo.
git add .
set /p commit_msg="O que voce mudou? (ex: Melhorei a tela de sucesso): "
git commit -m "%commit_msg%"
git push origin main

echo.
echo ==========================================
echo ✅ ATUALIZADO COM SUCESSO NO GITHUB!
echo O Vercel vai publicar as mudancas em 1 minuto.
echo ==========================================
pause
