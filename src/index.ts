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
    console.log('Here')
    // install compiler log
    let installArgs = [
      'tool',
      'install',
      '--global',
      'Basic.CompilerLog',
      '--add-source',
      'https://api.nuget.org/v3/index.json'
    ]

    console.log('Installing Basic.CompilerLog')
    let exitCode = await exec('dotnet', installArgs, { ignoreReturnCode: true })
    if (exitCode > 1) {
      throw new Error('dotnet tool install failed.')
    }

    // add .dotnet/tools to the path
    core.addPath(path.join(os.homedir(), '.dotnet', 'tools'))

    await exec('complog', ['create', '--out', 'build.complog'])

    console.log('Publishing the artifact')
    let client = artifact.create()
    await client.uploadArtifact('build.complog', ['build.complog'], '.')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
