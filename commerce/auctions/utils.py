from auctions.models import Bid

def get_bids_info(item_id):
    bids_max = 0
    bids_max_user = None
    
    bids = Bid.objects.filter(item=item_id)

    for bid in bids:
        if bid.price > bids_max:
            bids_max = bid.price
            bids_max_user = bid.user

    bids_amount = bids.count()

    return {"max": bids_max, "max_user": bids_max_user, "amount": bids_amount}
