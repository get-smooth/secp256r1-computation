.SILENT:

THIS_FILE := $(lastword $(MAKEFILE_LIST))

define shell-functions
: BEGIN
runcmd() {
	_cmd=$@;

	script_cmd="script -q /dev/null ${_cmd[@]} >&1";
	script -q /dev/null -c echo 2> /dev/null > /dev/null && script_cmd="script -q /dev/null -c \"${_cmd[@]}\" >&1";

	printf "\e[90;1m[\e[90;1mmake: \e[0;90;1mcmd\e[0;90;1m]\e[0m \e[0;93;1m➔ \e[97;1m$_cmd\e[0m\n" \
		&& ( \
			cmd_output=$(eval "$script_cmd" | tee /dev/tty; exit ${PIPESTATUS[0]}); cmd_exit_code=$?; \
			[ -z "$cmd_output" ] || ([ -z "$(tr -d '[:space:]' <<< $cmd_output)" ] && printf "\e[1A"); \
			[[ "$cmd_exit_code" -eq 0 ]] || return $cmd_exit_code \
		) \
		&& printf "\e[032;1m[✔︎] success\e[0m\n\n" \
			|| (_test_exit=$? \
				&& printf "\e[031;1m[✖︎] fail (exit code: $_test_exit)\e[0m\n\n" \
				&& return $_test_exit) \
			&& [ $? -eq 0 ] \
				|| return $?
}
: END
endef

$(shell sed -n '/^: BEGIN/,/^: END/p' $(THIS_FILE) > .make.functions.sh)
SHELL := /bin/bash --init-file .make.functions.sh -i

default:
	printf """\e[37musage:\e[0m\n \
		  \e[90m$$ \e[0;97;1mmake \e[0;92;1msage         \e[0;90m➔ \e[32;3mrun the sage implementation \e[0m\n \
		  \e[90m$$ \e[0;97;1mmake \e[0;92;1mnode         \e[0;90m➔ \e[32;3mrun the nodejs implementation \e[0m\n \
		  \e[90m$$ \e[0;97;1mmake \e[0;92;1mcompare         \e[0;90m➔ \e[32;3mcompare both implementation \e[0m\n \
		  \e[90m$$ \e[0;97;1mmake \e[0;92;1mcompare-v         \e[0;90m➔ \e[32;3mcompare both implementation in verbose mode \e[0m\n \
	""" | sed -e 's/^[ \t	]\{1,\}\(.\)/  \1/'

# this is an deterministic public key used to when you run the node or the sage implementation
# the `compare` command will not use it because it will generate a new random one each time
export C0=98061909492058364035111048019882274619202725064600646935165851115135261780351
export C1=74929535114941118713606544864289432912040932364790560608603694518983240388424

.PHONY: sage-run
sage-run:
	@runcmd sage src/sage/precomputation.sage

.PHONY: node-run
node-run:
	@runcmd node src/precomputation.js

.PHONY: compare-implem
compare-implem:
	@runcmd bash compare.sh

.PHONY: compare-implem-verbose
compare-implem-verbose:
	@runcmd bash compare.sh -v

# this command run the sagemath implementation
sage: sage-run

# this command run the nodejs implementation
node: node-run

# this command compare both implementation
compare: compare-implem
# this command compare both implementation AND print both outputs
compare-v: compare-implem-verbose
