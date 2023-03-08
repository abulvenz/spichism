#!/usr/bin/gnuplot -persist

# Abstand des Planeten vom Startpunkt des Raumschiffs
p(t)=((r*cos(o*t)-x1)**2+(r*sin(o*t)-y1)**2+z1**2)

# Abstand Planet zu Raumschiff zu einer bestimmten Zeit,
# wenn das Raumschiff diesen Punkt angesteuert hätte
f(t)=p(t)-(v*t)**2

GNUTERM = "qt"

# Radius der Planetenbahn
r = 100

# Winkelgeschwindigkeit des Planeten
o = 50

# Geschwindigkeit des Raumschiffs
v = 150

# Startpunkt des Raumschiffs
x1 = 0
y1 = 200
z1 = 200

d = sqrt(x1**2+y1**2+z1**2)

s_min = abs(d - r)
t_min = s_min / v

s_max = d + r
t_max = s_max / v


f_(t)=2*o*r*((r*cos(o*t)-x1)*-sin(o*t)+(r*sin(o*t)-y1)*cos(o*t))+2*v*t

#set terminal pdf
#set output "plots.pdf"

#set xtics 0.01
#set yrange [-10:30]

set samples 1000

set multiplot layout 3,1
plot [t=t_min:t_max] f(t) w l,0 w l
plot [t=t_min:t_max] p(t) w l,(v*t)**2 w l
plot [t=t_min:t_max] f_(t) w l,0 w l

pause -1