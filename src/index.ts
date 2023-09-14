import * as core from '@actions/core'
import { exec } from '@actions/exec'
import * as artifact from '@actions/artifact'
import * as os from 'os'
import * as path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    await installCompilerLog()

    // add .dotnet/tools to the path
    core.addPath(path.join(os.homedir(), '.dotnet', 'tools'))

    const complogFile = await runCompilerLog()
    await publishCompilerLog(complogFile)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function installCompilerLog(): Promise<void> {
  // install compiler log
  const installArgs = [
    'tool',
    'install',
    '--global',
    'Basic.CompilerLog',
    '--add-source',
    'https://api.nuget.org/v3/index.json'
  ]

  console.log('Installing Basic.CompilerLog')
  const exitCode = await exec('dotnet', installArgs, {
    ignoreReturnCode: true
  })

  if (exitCode > 1) {
    throw new Error('dotnet tool install failed.')
  }
}

async function runCompilerLog(): Promise<string> {
  const args = ['create', '--out']

  let output = core.getInput('complog')
  if (isNullOrEmpty(output)) {
    output = 'build.complog'
  }

  console.log('Using ${output}')
  args.push(output)

  await exec('complog', args)
  return output
}

async function publishCompilerLog(complogFile: string): Promise<void> {
  console.log('Publishing the artifact')
  let name = core.getInput('artifact')
  if (isNullOrEmpty(name)) {
    name = 'build.complog'
  }
  const client = artifact.create()
  await client.uploadArtifact(name, [complogFile], '.')
}

function isNullOrEmpty(str: string): boolean {
  return str === null || str === ''
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
