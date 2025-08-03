# Configurar JAVA_HOME Permanentemente no Windows

## Método 1: Via Interface Gráfica (Recomendado)

1. **Abra as Variáveis de Ambiente do Sistema:**
   - Pressione `Windows + R`
   - Digite `sysdm.cpl` e pressione Enter
   - Clique na aba "Avançado"
   - Clique em "Variáveis de Ambiente"

2. **Configure JAVA_HOME:**
   - Na seção "Variáveis do Sistema", clique em "Novo"
   - Nome da variável: `JAVA_HOME`
   - Valor da variável: `C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot`
   - Clique em "OK"

3. **Atualize o PATH:**
   - Na seção "Variáveis do Sistema", encontre a variável `Path`
   - Clique em "Editar"
   - Clique em "Novo"
   - Adicione: `%JAVA_HOME%\bin`
   - Clique em "OK" em todas as janelas

4. **Reinicie o PowerShell/CMD** para aplicar as mudanças

## Método 2: Via PowerShell como Administrador

Execute o PowerShell como Administrador e digite:

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot", "Machine")
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "Machine") + ";%JAVA_HOME%\bin", "Machine")
```

## Verificar a Configuração

Após configurar, execute:

```powershell
echo $env:JAVA_HOME
java -version
```

## Para o Projeto Atual

Para esta sessão, você pode usar:

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot"
```