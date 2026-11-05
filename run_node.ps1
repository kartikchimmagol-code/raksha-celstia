$nodeDir = "C:\Users\karti\AppData\Local\Programs\node-v22.11.0-win-x64"
$env:PATH = "$nodeDir;$env:PATH"

if ($args.Count -gt 0) {
    $cmd = $args[0]
    $cmdArgs = if ($args.Count -gt 1) { $args[1..($args.Count - 1)] } else { @() }
    & $cmd @cmdArgs
}
