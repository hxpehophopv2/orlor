#### How to read this sheet

<...>  hides the part you have to work out. Sometimes that is the command:

$ <...>
Listing... Done

and sometimes it is what the command prints:

$ id
uid=<...> gid=<...>

Everything not hidden is there to help you. The sample output shows you
where to
look and what shape the answer takes, so you can tell a working system from
a
broken one.

Several questions in Parts 2, 3 and 4 ask you to watch what happens and
report it.
Those are answered with  yes  or  no  — a short sentence after it is fine,
but the
yes  or the  no  is the answer, and there is no way to work it out without
running the
step.



--------

### Part 1 - Seeing what is running

Every question in this part is answered by looking. The misconception it
attacks is
that  ps  shows you the system — on its own,  ps  shows you almost nothing:
only the processes attached to your own terminal. That is why "I ran  ps
and my
service wasn't there" is not evidence of anything.

Command                 │ What it reports
─────────────────────────┼────────────────────────────────────────────────
ps                     │ Processes on your terminal only
ps aux                 │ Every process on the machine, BSD style, with
│  %CPU  and  %MEM
ps -ef                 │ Every process, UNIX style, with the  PPID
│ column
ps -o <cols> -p <pid>  │ Choose your own columns for one process
ps -C <name>           │ Select by command name instead of pid
pstree -p              │ The same processes drawn as the tree they
│ actually form
pgrep -a <pattern>     │ Find a process by name, without piping  ps
│ into  grep
top  /  htop           │ The same information, refreshing.  q  quits
ss -tln                │ Which ports are listening

Two identifiers appear throughout this lab, and confusing them makes Part 4
impossible:

$ ps -ef | head -2
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 Aug05 ?        00:00:26 /sbin/init
^^^     ^^^^
|       parent process id — who started it
process id — this process

1. Run  ps  with no options at all. Two processes are listed, and one of
them is
ps  itself. What is the other one? →  T1
$ ps
PID TTY          TIME CMD
54754 pts/1    00:00:00 <...>
54764 pts/1    00:00:00 ps
Only two, on a machine running well over a hundred. That is the point of the
step:  ps  alone reports your terminal, not your system.
2. Now list every process on the machine, both ways, and count them.
$ ps aux | head -4
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.3  22632 13932 ?        Ss   Aug05   0:26
/sbin/init
root           2  0.0  0.0      0     0 ?        S    Aug05   0:00
[kthreadd]
root           3  0.0  0.0      0     0 ?        S    Aug05   0:00
[pool_workqueue_release]
$ ps aux | wc -l
126
$ ps -ef | head -2
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 Aug05 ?        00:00:26 /sbin/init
aux  and  -ef  are two different option styles doing nearly the same job —
BSD
and UNIX.  -ef  is the one with the  PPID  column, which is why the rest of
this
lab uses it. Your count will differ from 126.
3. Your shell has a parent — the process that started it when you logged in.
Find
its  PPID , then find out what that process is. What command is it? →  T3
Hint:  $$  is your own shell's pid. Look up the  PPID  it reports, then ask
ps  about that pid.
$ ps -o pid,ppid,user,stat,cmd -p $$
PID    PPID USER     STAT CMD
54754   54753 sysadmin S    <...>
$ ps -o cmd= -p <the PPID from above>
<...>
Give the command name, not the pid — the pid is different every time you log
in, and the answer to this question is not.
4. Which user does the  cron  service run as? →  T4
$ ps -o user,pid,cmd -C cron
USER         PID CMD
<...>        819 /usr/sbin/cron -f -P
Worth remembering for class 3, when you meet a service that deliberately
does
not run as this user.
5. Draw the process tree and find your own shell in it.
$ pstree -p | head -6
systemd(1)-+-ModemManager(904)-+-{ModemManager}(940)
|                   |-{ModemManager}(945)
|                   `-{ModemManager}(947)
|-agetty(917)
|-cron(819)
|-dbus-daemon(820)
Everything on the machine hangs off one process at the far left. You met it
in
lab01 as pid 1; here you can see that it is not a fact about pid 1 but about
every process — they all descend from it.
6. List the listening ports. The system resolver listens on the address
127.0.0.53 . On which port? →  T6
$ ss -tln
State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port
LISTEN 0      4096    127.0.0.53%lo:<...>       0.0.0.0:*
LISTEN 0      4096          0.0.0.0:22         0.0.0.0:*
Your list may have more lines than this. Port 22 is the one you are
connected
over. From class 3 onwards, this command is how you answer "is my server
actually listening?" — and the answer is very often no.Try  ss -tlnp  as
well. The extra  p  asks for the process behind each port,
and you will find the column mostly empty: seeing who owns a port you do not
own
needs root.
7. Run  top . The first line ends with three load-average figures. They are
averages
over the last 1 minute, 5 minutes and how many minutes? →  T7 Hint:  top
documents its own display.  man top , section 2a. UPTIME and
LOAD Averages, describes this exact line. Inside  man , type  /load average
and Enter to jump to it — and  q  quits, the same key  top  itself uses.
$ top
top - 00:15:30 up 6 days, 22:56,  1 user,  load average: 0.00, 0.00, 0.00
Tasks: 125 total,   1 running, 124 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.
0 st
MiB Mem :   3848.6 total,   2157.2 free,    527.2 used,   1444.6
buff/cache
Press  q  to quit — not  CTRL+C , though that works too.  htop  is the same
idea with colours and a mouse; both are installed.



--------

### Part 2 - Your terminal owns your processes

The misconception this part attacks: that a program you started keeps
running, and
keeps printing, once you have gone. Two different things can happen to it
when your
session ends — it can be killed, and its output can be lost — and they are
not the
same thing. One can happen without the other. The next five steps are
experiments to
find out which happens when, and sorting them out is the single reason the
rest of this
course exists.

SIGHUP  is the signal a terminal sends when it hangs up — the name is left
over
from the days of modems. Which processes get it, and when, is what this part
is about.

Command                     │ What it does
─────────────────────────────┼────────────────────────────────────────────
<cmd> &                    │ Start it in the background of this shell
jobs                       │ Background jobs of this shell, numbered
│  %1 ,  %2  …
CTRL+C                     │ Send  SIGINT  — ask the foreground program
│ to stop
CTRL+Z                     │ Suspend the foreground program, leaving it
│ stopped
bg                         │ Resume a suspended job, in the background
fg                         │ Bring a background job back to the
│ foreground
kill %1                    │ Kill by job number rather than by pid
nohup <cmd> &              │ Start it with  SIGHUP  ignored, and its
│ output sent to a file
shopt -s huponexit         │ Ask this shell to hang up on its own jobs
│ when it exits
readlink /proc/<pid>/fd/1  │ Where that process's standard output
│ actually goes

8. Create  heartbeat.sh  in  ~/int134/lab02/ , with exactly this content,
and make it
executable.
#!/usr/bin/env bash
while true; do
echo "heartbeat $(date '+%F %T')"
sleep 5
done
#!  must be the very first two characters of the file — no spaces in
front of it, and no blank line above it. Pasting from a rendered page adds
one
or both without showing you, and the damage is invisible: the script still
runs when you type  ./heartbeat.sh , but Linux never reads the  #!  line.
What
starts is then not the program you wrote, and it is not named after your
script, so commands that look for it by name do not find it — and in Part 4
systemd rejects the same file outright with  status=203/EXEC .Check the file
before you go on:
$ head -1 heartbeat.sh
#!/usr/bin/env bash
$ file heartbeat.sh
heartbeat.sh: Bourne-Again shell script, ASCII text executable
file  reads that first line the same way the kernel does. If it answers
ASCII text  and nothing more, the  #!  is not being seen — delete whatever
is
in front of it and check again.
$ ls -l heartbeat.sh
-rwxrwxr-x 1 sysadmin sysadmin 91 Aug 12 13:40 heartbeat.sh
Note what it does with its output: it  echo s to the screen and writes to no
file at all. Where those lines end up changes twice in this lab, and that is
the
thread running through it.
9. Run it in the foreground. Watch two or three heartbeats, then stop it
with
CTRL+C .
$ ./heartbeat.sh
heartbeat 2026-08-12 13:41:02
heartbeat 2026-08-12 13:41:07
^C
Your shell was unusable while it ran. That is what "foreground" means.
10. Now run it in the background with  & , list your jobs, bring it back
with  fg ,
suspend it with  CTRL+Z , resume it in the background with  bg , and finally
kill it by job number.
$ ./heartbeat.sh &
[1] 55012
$ jobs
[1]+  Running                 ./heartbeat.sh &
$ fg
./heartbeat.sh
heartbeat 2026-08-12 13:42:15
^Z
[1]+  Stopped                 ./heartbeat.sh
$ bg
[1]+ ./heartbeat.sh &
$ kill %1
[1]  is the job number and  55012  is the pid — two different numbering
systems for the same process. Job numbers exist only inside this one shell.
11. Start it in the background with  &  again — and this time redirect
nothing.
Let it print straight to your terminal. Watch a heartbeat or two, then log
out
completely and log back in with ssh. Is it still running? →  T11
$ ./heartbeat.sh &
[1] 55120
heartbeat 2026-08-12 13:45:02
heartbeat 2026-08-12 13:45:07
$ exit
Log back in, then:
$ pgrep -af heartbeat.sh
<...>
The  -f  matters. Without it  pgrep  matches only the process name, which
for a shell script is  bash  — so  pgrep -a heartbeat.sh  finds nothing
whether
your script is running or not.  -f  matches the whole command line. pgrep
prints nothing and returns a non-zero status when it finds nothing.
Silence from it is an answer either way, not a broken command.
12. The shell that started it is gone. Find out what that process's parent
process
id is now. →  T12 No new command for this one. Step 3 asked you for your own
shell's parent and
you found it with  ps -o ; step 11 gave you a way to get the pid without
typing
it out. Put the two together.A process whose parent dies is not killed — it
is adopted. Compare this
PPID  with the tree you drew in step 5, and with lab01's step 28.Write the
pid down as well. Step 14 asks you to kill this one.
13. Your script has been echoing a line every five seconds all this time,
and those
lines were going to the terminal you logged out of. Go and find them. Look
in
the lab directory first, then ask the process itself where its standard
output
actually points. Is anything collecting its output? →  T13
$ readlink /proc/<the pid from step 12>/fd/1
<...>
Listing the directory needs nothing you have not used since class 1. Only
the
second command is new. /proc/<pid>/fd/1  is where a running process's
standard output really goes —
file descriptor 1 is stdout, and  /proc  will tell you about any process you
own. Read the answer carefully: it names the terminal you started in, and
then
it tells you what has become of that terminal.Two separate things can go
wrong when you leave: whether the process is still
alive, and whether anything is still listening to it. Steps 11 and 13 are
asking
you about one each, and they do not have to have the same answer.
14. Clean up, and then stop it happening again. First deal with the process
from
step 11 — kill it, using the pid you wrote down. Then start the script the
same
way once more, but ask this shell to hang up on its jobs before you leave.
Log
out, log back in. Is that one still running? →  T14
$ kill <the pid you wrote down in step 12>
$ shopt -s huponexit
$ ./heartbeat.sh &
[1] 55380
$ exit
Check it the same way you did in step 11, and read the result carefully.
huponexit  is off by default, which is what step 11 was showing you. It
belongs to one shell and one shell only: log in again and it is off again.
So
it is useful for tidiness and it is not how anything gets deployed.  shopt
on
its own lists every option and whether it is set.There is a third way to
leave, and you have almost certainly done it by
accident: closing the window, or losing your connection. That is not a
polite
exit — the terminal hangs up, bash itself is sent  SIGHUP , and an
interactive bash that receives  SIGHUP  passes it on to its own jobs before
it
dies, whatever  huponexit  says. That is why "I logged out and my program
died"
and "I logged out and my program kept going" are both things people have
seen.
15. Sometimes you do want it to keep running — and you want to keep what it
says.
Start the script one more time with  nohup , read the line  nohup  prints
before you do anything else, log out, and log back in.Which file has been
collecting its output this time? →  T15
$ cd ~/int134/lab02
$ nohup ./heartbeat.sh &
[1] 55240
nohup: ignoring input and appending output to '<...>'
$ exit
Log back in, check the process is still there the way step 11 taught you,
then
read the last few lines of that file. The timestamps keep advancing while
you
are not logged in.Now look at that file's permissions, and note who is
allowed to read it.
$ ls -l <...>
-rw------- 1 sysadmin sysadmin 390 Aug 12 13:50 <...>
The checker runs as a different account, which is a member of your
sysadmin  group — so as this file stands it cannot be read, and your work
here cannot be checked. Give the  sysadmin  group read permission on it.
You met  ls -l  and  chmod  in lab01 part 2; the command is yours to work
out. nohup  creates this file private to you — mode  600 , nobody else at
all.
That is a sensible default, and this is lab01 part 2 again, on a file you
did
not create by hand. nohup  did two separate things for you, and they are
worth separating: it
arranged for the program to ignore  SIGHUP , and it gave the program's
output
somewhere to land that is not a terminal. Step 11 had neither of those,
which
is why it ended up the way it did.Do not kill this one. Step 29 refers back
to it, and nothing later in
this lab asks you to stop it.



--------

### Part 3 - Signals

The misconception this part attacks: that  kill  kills.  kill  sends a
signal —
a numbered message — and the one it sends by default is a polite request
that a
program is entirely free to catch and ignore. Knowing this is what explains
why
systemctl stop  sometimes sits there for ninety seconds.

Signal                │ Number                │ What it means
───────────────────────┼───────────────────────┼──────────────────────────
SIGHUP               │ 1                     │ Your terminal went away
SIGINT               │ 2                     │  CTRL+C  — please stop
SIGKILL              │ 9                     │ Stop, now, by the kernel
SIGTERM              │ 15                    │ Please shut down cleanly

Command              │ What it does
──────────────────────┼───────────────────────────────────────────────────
kill -l             │ List every signal this system knows
kill <pid>          │ Send the default signal
kill -9 <pid>       │ Send signal 9 specifically
pkill -f <pattern>  │ Kill everything whose command line matches
trap '<cmd>' TERM   │ In a script: run  <cmd>  instead of dying on
│  SIGTERM

16. List the signals. Then find, in  man kill  or  help kill , which signal
number
plain  kill  sends when you do not name one. →  T16
$ kill -l
1) SIGHUP   2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
6) SIGABRT  7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
11) SIGSEGV 12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
...
The list tells you the numbers. It does not tell you which one is the
default —
that is in the manual.
17. Create  stubborn.sh  in  ~/int134/lab02/ , with exactly this content,
and make it
executable.
#!/usr/bin/env bash
trap 'echo "caught it — not going anywhere"' TERM
while true; do
sleep 1
done
The  trap  line replaces the default behaviour for one signal. Everything
else
about the script is filler that keeps it alive so you have something to aim
at.
18. Run it in the background, note its pid, and send it the default signal.
Watch
what happens.
$ ./stubborn.sh &
[1] 55401
$ kill 55401
caught it — not going anywhere
$ jobs
[1]+  Running                 ./stubborn.sh &
You asked it to stop. It declined, and told you so. A real service does
exactly
this — it catches  SIGTERM  so it can finish writing to disk before exiting.
19. Now send it signal 9 instead, and check again. Of the two commands you
have now
run against it, which one actually ended it? →  T19
$ <...>
$ jobs
[1]+  Killed                  ./stubborn.sh

20. Steps 18 and 19 sent two different signals to the same script. One of
them it
was able to refuse; the other it was not. Which signal number was the one
it could not catch, block or ignore? →  T20 That is why this one always
works — and why it is the wrong thing to reach
for first. A program stopped this way gets no chance to close a file or
finish
a database write. Ninety seconds of  systemctl stop  waiting is systemd
being
polite before it resorts to it.



--------

### Part 4 - Hand it to systemd

The misconception this part attacks: that "it's running" is the same as
"it's
deployed". Your  nohup  process from step 15 survives a logout. It will not
survive a reboot, nothing will restart it if it crashes, and no one but you
knows it
is supposed to exist. Turning a program into a service fixes all three at
once.

A unit file has three sections:

Section     │ Holds
─────────────┼────────────────────────────────────────────────────────────
[Unit]     │ Description and ordering — what this is, and what it needs
[Service]  │ How to run it: the command, the user, what to do when it
│ stops
[Install]  │ What  systemctl enable  should hook it to

The directives you need:

Directive      │ Section     │ What it does
────────────────┼─────────────┼─────────────────────────────────────────────
Description=  │  [Unit]     │ The text  systemctl status  shows first
ExecStart=    │  [Service]  │ The command to run. Absolute path
User=         │  [Service]  │ Which account it runs as. Without it, root
Restart=      │  [Service]  │  always  — bring it back whenever it stops
WantedBy=     │  [Install]  │  multi-user.target  — the normal boot state

21. Create  /etc/systemd/system/int134-heartbeat.service . It must run your
heartbeat.sh  from step 8, as the  sysadmin  user, restarting always, and
be
installable into  multi-user.target .
[Unit]
Description=<...>

[Service]
ExecStart=<...>
User=<...>
Restart=<...>

[Install]
WantedBy=<...>
You need  sudo  to write here, and it will ask for your password. ExecStart
is where first unit files go wrong. systemd does not run your
script from a shell: it does not expand  ~ , it has no idea what directory
you
were in, and a relative path simply fails. Give it the full path, starting
with  / .Now start the service, and then ask for its status. Both commands
are
lab01 part 4 and the unit is called  int134-heartbeat ; starting it needs
sudo , asking about it does not.
$ <...>
$ <...>
● int134-heartbeat.service - <the description you wrote>
Loaded: loaded (/etc/systemd/system/int134-heartbeat.service;
disabled; preset: enabled)
Active: <...> since Wed 2026-08-12 23:47:32 +07; 1s ago
Main PID: 63047 (bash)
You have not run a single command to tell systemd this file exists, and it
started anyway. Ask for a unit it has not heard of and it goes and looks —
which is worth knowing, because the next step is about the one thing it will
not do for you.
22. Now change the  Description  line to something else, save, and run
systemctl status int134-heartbeat  again. Read the top two lines carefully:
the description systemd shows you, and the warning above it. Which command
does the warning tell you to run? →  T22
$ systemctl status int134-heartbeat
Warning: The unit file, source configuration file or drop-ins of int134-
heartbeat.service changed on disk. Run '<...>' to reload units.
● int134-heartbeat.service - <the description you have just replaced>
systemd read your unit file when you started the service and kept a copy in
memory. That copy is what it is running, and editing the file on disk does
not
touch it — which is why  status  is still showing you the old description.
The
warning is systemd noticing that the two have drifted apart. It appeared
this
time and not in step 21 for one reason: in step 21 there was no copy in
memory
to have drifted from.
23. Run that command, then run  systemctl status  once more and look at the
description again. Then enable and start the service in one go with
sudo systemctl enable --now int134-heartbeat .
$ sudo systemctl enable --now int134-heartbeat
Created symlink /etc/systemd/system/multi-user.target.wants/int134-
heartbeat.service → /etc/systemd/system/int134-heartbeat.service.
Reloading re-reads the file into memory. Your new description appears
without
restarting anything, because nothing about the running process had to change
—
if you had edited  ExecStart  instead, the reload would update systemd's
copy
and the old command would keep running until a  restart .It is already
running, so  --now  has nothing to do here;  enable  is the half
that matters. That symlink is what  [Install] WantedBy=  was for, and it is
the
whole of what "enabled" means. Without an  [Install]  section there is
nothing
to link and  enable  fails.
24. Check both states separately. What does  is-active  print? →  T24
$ systemctl is-enabled int134-heartbeat
enabled
$ systemctl is-active int134-heartbeat
<...>
Two independent states, exactly as in lab01 part 4 — except this time it is
your own service.
25. Look at the full status, note the Main PID, and find that same pid with
ps .
$ systemctl status int134-heartbeat
● int134-heartbeat.service - Heartbeat for INT134 lab02
Loaded: loaded (/etc/systemd/system/int134-heartbeat.service; enabled;
preset: enabled)
Active: <...> since Wed 2026-08-12 14:20:11 +07; 30s ago
Main PID: 55780 (bash)
$ ps -o pid,ppid,user,cmd -p 55780
Note which user it is running as, and note its  PPID . You have seen that
number before, in step 12. status  names the program systemd started, which
for a shell script is the
interpreter rather than the script — the same reason  pgrep  needed  -f
back
in step 11.  ps  shows you the whole command line, script and all.
26. Kill that process. Part 3 gave you more than one way to do it; choose
one,
and then make sure it worked — use  pgrep  as in step 11 to confirm that the
pid you noted is no longer there. Then look at the status again and compare
the Main PID with the one you noted: is it the same number, or a different
one? →  T26
$ <...>
$ pgrep -af heartbeat.sh
<...>
$ systemctl status int134-heartbeat
Active: <...> since Wed 2026-08-12 23:47:03 +07; 1s ago
Main PID: <...> (bash)
It runs as  sysadmin , which is you, so signalling it needs no  sudo .This
is the step the whole lab is built towards. You stopped the
process, and the service is still running.  Restart=always  is the
difference
between a program and a deployment: the service is not the process.
27. Your script is still  echo ing every five seconds — but not to your
terminal,
and not to  nohup.out  either. Find the command that shows a service's
output. →  T27 Hint:  systemctl  manages units; a different command reads
their logs. Name the
unit when you run it, or you will get the whole system's log.
$ <...>
Aug 12 14:21:03 int134 heartbeat.sh[55901]: heartbeat 2026-08-12 14:21:03
Aug 12 14:21:08 int134 heartbeat.sh[55901]: heartbeat 2026-08-12 14:21:08
Aug 12 14:21:13 int134 heartbeat.sh[55901]: heartbeat 2026-08-12 14:21:13
Same script, same  echo , third destination: the terminal in step 9,
nohup.out  in step 15, and the system journal here. You never changed the
script — you changed who was running it. -n 20  shows the last twenty lines,  -
f  follows live, and  --since "10 min ago"
takes a time. From class 3 on, this is where you will find out why your
server
will not start.
28. Reboot the machine. Wait about a minute, log back in, and check the
service.
Is it running? →  T28
$ sudo reboot
Connection to int134 closed by remote host.

$ systemctl is-active int134-heartbeat
You did not start it. Being enabled is what brought it back — the same
distinction lab01 part 4 made with  cron , now on a service you wrote.
29. Check on the  nohup  process from step 15, which you left running. Is it
still
there? →  T29
$ pgrep -af heartbeat.sh
825 bash /home/sysadmin/int134/lab02/heartbeat.sh
Remember  -f  from step 11. Read that line carefully before answering: there
were two copies of this script running before the reboot, and only one
line comes back. Tell them apart by the path — systemd runs the absolute
ExecStart  path you gave it in step 21, while the one you started by hand
in
step 15 was  ./heartbeat.sh . The question is about that second one.Two
copies of one script, started two ways, and only one of them came back.
That difference is what the word "deployment" means in this course, and
every
remaining class assumes it.



--------

# INT134 System Deployment — Managing Processes
#
# Put each answer inside a `|` block, exactly as you will write `run: |` in
# Docker Compose and GitHub Actions later in this course.  Indentation
matters:
# the answer lines sit two spaces further in than their key.
#
# Only what is inside the blocks is marked. You may leave an answer blank.
#
# Fill in student_id and student_name below. They are checked against the VM
you
# are submitting from, so a wrong id is reported back to you on your next
push.

student_id: "68130500035"      # your 11-digit student number
student_name: "Teeruch Songtalay"

answers:
# Step 1 — which of the commands `ps` listed is your shell?
T1: |
bash

# Step 3 — what command is your shell's parent process?
T3: |
sshd: sysadmin@pts/1

# Step 4 — which user does cron run as?
T4: |
root

# Step 6 — which port is listening on 127.0.0.53?
T6: |
53

# Step 7 — the third load-average figure covers how many minutes?
T7: |
15

# Step 11 — after logging out and back in, was it still running?
T11: |
yes

# Step 12 — what is its parent process id now?
T12: |
1

# Step 13 — is anything collecting its output?
T13: |
no

# Step 14 — with huponexit switched on, was it still running?
T14: |
no

# Step 15 — which file collected its output?
T15: |
nohup.out

# Step 16 — which signal number does plain `kill` send?
T16: |
SIGTERM

# Step 19 — which of the two commands actually ended it?
T19: |
kill -s SIGKILL 52110

# Step 20 — which signal number can a program not catch?
T20: |
9

# Step 22 — which command did systemd tell you to run?
T22: |
systemctl daemon-reload

# Step 24 — what does `systemctl is-active` print?
T24: |
active

# Step 26 — after you killed it, was the Main PID the same or different?
T26: |
different

# Step 27 — which command showed you the script's output?
T27: |
journalctl -u int134-heartbeat

# Step 28 — after the reboot, was the service running?
T28: |
yes

# Step 29 — after the reboot, was the nohup process still running?
T29: |
no
