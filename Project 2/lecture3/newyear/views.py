import datetime
from django.shortcuts import render

# Create your views here.

def index(request):
    date = datetime.datetime.now()
    if date.month == 12 and date.day == 31:
        newyear = True
    else:
        newyear = False

    return render(request, "newyear/index.html", {
        "newyear": newyear
    })