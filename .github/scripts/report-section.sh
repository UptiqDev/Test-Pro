#!/usr/bin/env bash
# Builds one scan's section of the vulnerability report.
#
# Usage: report-section.sh <id> <title> <tool> <step-outcome>
#
# Reads (all optional, so a failed scan still produces a section):
#   reports/<id>.txt          human-readable findings
#   reports/<id>.log          full scanner output (errors land here)
#   reports/_meta/<id>.count  one-line findings count
# Writes:
#   reports/_meta/<id>.section.txt   section for vulnerability-report.txt
#   reports/_meta/<id>.summary       "title<TAB>status<TAB>findings"
set -u

id=$1
title=$2
tool=$3
outcome=${4:-}

dir=reports
meta=$dir/_meta
mkdir -p "$meta"

case "$outcome" in
    success) status='passed' ;;
    failure) status='FAILED - scanner error, see log' ;;
    '') status='not run' ;;
    *) status=$outcome ;;
esac

findings='n/a'
[ -s "$meta/$id.count" ] && findings=$(cat "$meta/$id.count")

{
    echo '================================================================'
    echo " $(echo "$title" | tr '[:lower:]' '[:upper:]')"
    echo '================================================================'
    echo "Status   : $status"
    echo "Tool     : $tool"
    echo "Findings : $findings"
    echo
    echo '---- Findings ----'
    if [ -s "$dir/$id.txt" ]; then cat "$dir/$id.txt"; else echo '(no report produced)'; fi
    echo
    echo '---- Scanner log ----'
    if [ -s "$dir/$id.log" ]; then cat "$dir/$id.log"; else echo '(no log)'; fi
    echo
} > "$meta/$id.section.txt"

printf '%s\t%s\t%s\n' "$title" "$status" "$findings" > "$meta/$id.summary"
