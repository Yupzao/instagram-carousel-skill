# Synthesises each line of <Dir>/script.json (a JSON array of sentences) with a Windows voice (WinRT, offline, free)
# into line-NN.wav, and writes words.json with the start time of every word (for synced captions).
# Usage: powershell -ExecutionPolicy Bypass -File tts.ps1 -Dir <output> [-Voice 'Microsoft Mark'] [-Rate '+8%']
# List voices: [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null; [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
param([string]$Dir = '.', [string]$Voice = 'Microsoft Mark', [string]$Rate = '+8%')
$ErrorActionPreference = 'Stop'
$here = (Resolve-Path $Dir).Path
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
  $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [Type]$type) { $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op)); $t.Wait(-1) | Out-Null; $t.Result }

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -eq $Voice } | Select-Object -First 1
$synth.Options.IncludeWordBoundaryMetadata = $true

$lines = Get-Content (Join-Path $here 'script.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$out = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
  $text = [System.Security.SecurityElement]::Escape($lines[$i])
  $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><prosody rate='$Rate'>$text</prosody></speak>"
  $stream = Await ($synth.SynthesizeSsmlToStreamAsync($ssml)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
  $null = Await ($reader.LoadAsync([uint32]$stream.Size)) ([uint32])
  $bytes = New-Object byte[] ([int]$stream.Size); $reader.ReadBytes($bytes)
  $file = Join-Path $here ('line-{0:D2}.wav' -f $i)
  [IO.File]::WriteAllBytes($file, $bytes)
  $words = @()
  foreach ($track in $stream.TimedMetadataTracks) {
    foreach ($cue in $track.Cues) { $words += [pscustomobject]@{ w = $cue.Text; t = [math]::Round($cue.StartTime.TotalSeconds, 3) } }
  }
  $out += [pscustomobject]@{ line = $i; text = $lines[$i]; file = (Split-Path -Leaf $file); words = $words }
  Write-Output ('{0:D2} {1} words  {2}' -f $i, $words.Count, $lines[$i])
}
$out | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $here 'words.json') -Encoding UTF8
