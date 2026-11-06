param(
  [Parameter(Mandatory = $true)][string]$ZipPath,
  [Parameter(Mandatory = $true)][string]$Destination
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Path]::GetFullPath($ZipPath)
$root = [System.IO.Path]::GetFullPath($Destination)
New-Item -ItemType Directory -Path $root -Force | Out-Null
$prefix = $root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$archive = [System.IO.Compression.ZipFile]::OpenRead($zip)
try {
  foreach ($entry in $archive.Entries) {
    $target = [System.IO.Path]::GetFullPath((Join-Path $root $entry.FullName))
    if (-not $target.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "El ZIP contiene una ruta insegura: $($entry.FullName)"
    }
  }
} finally {
  $archive.Dispose()
}
[System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $root)
