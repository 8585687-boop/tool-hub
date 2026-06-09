/**
 * Line-level diff using simple LCS-based algorithm.
 * Returns per-line status for left and right panels.
 */

function lcs(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  // backtrack
  const leftDiff = []
  const rightDiff = []
  let i = m, j = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      leftDiff.unshift({ type: 'same', content: a[i - 1] })
      rightDiff.unshift({ type: 'same', content: b[j - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rightDiff.unshift({ type: 'added', content: b[j - 1] })
      j--
    } else {
      leftDiff.unshift({ type: 'removed', content: a[i - 1] })
      i--
    }
  }

  return { leftDiff, rightDiff }
}

export function computeDiff(text1, text2) {
  if (!text1 && !text2) {
    return { leftDiff: [], rightDiff: [], added: 0, removed: 0, changed: false }
  }

  const lines1 = text1.split('\n')
  const lines2 = text2.split('\n')
  const { leftDiff, rightDiff } = lcs(lines1, lines2)

  const added = rightDiff.filter(d => d.type === 'added').length
  const removed = leftDiff.filter(d => d.type === 'removed').length

  return { leftDiff, rightDiff, added, removed, changed: added > 0 || removed > 0 }
}
