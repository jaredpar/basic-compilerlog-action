# Compiler Logs Action

This action makes it easy to create and publish [compiler logs](https://github.com/jaredpar/basic-compilerlog) from GitHub Actions.

## Usage

To use this action make sure that the build is producing a [binary log file](https://github.com/dotnet/msbuild/blob/main/documentation/wiki/Providing-Binary-Logs.md). The compiler log action will create a compiler log file from that and upload it to the executing action.

```yaml
  - name: Build .NET app
    run: dotnet build -bl

  - name: Create Compiler Log
    uses: jaredpar/basic-compilerlog-action@v1
    with:
      binlog: msbuild.binlog
```
