import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Mail, Calendar, CheckCircle } from 'lucide-react';
import { GoogleSignInBtn } from './GoogleSignInBtn';

interface Props {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export function WorkspaceFeatures({ user, token, setUser, setToken }: Props) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [calendarStatus, setCalendarStatus] = useState<'idle' | 'adding' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    if (!token || !user) return;
    
    // We need user confirmation!
    const confirmed = window.confirm('Send a test inquiry email to Delights from your Gmail account?');
    if (!confirmed) return;

    setEmailStatus('sending');
    try {
      const emailContent = [
        `To: ${user.email}`,
        'Subject: Inquiry from Delights Dessert Shop',
        'Content-Type: text/plain; charset=utf-8',
        '',
        message || 'Hello! I am interested in visiting Delights.'
      ].join('\r\n');

      const encodedEmail = btoa(emailContent).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedEmail })
      });

      if (res.ok) {
        setEmailStatus('success');
        setTimeout(() => setEmailStatus('idle'), 3000);
        setMessage('');
      } else {
        console.error('Failed to send email:', await res.text());
        setEmailStatus('idle');
      }
    } catch (err) {
      console.error(err);
      setEmailStatus('idle');
    }
  };

  const addCalendarEvent = async () => {
    if (!token) return;
    
    const confirmed = window.confirm('Add a reminder to visit Delights to your Google Calendar?');
    if (!confirmed) return;

    setCalendarStatus('adding');
    try {
      // Create event for tomorrow at 2 PM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(15, 0, 0, 0);

      const event = {
        summary: 'Visit Delights Dessert Shop',
        location: 'Arcades Shopping Mall, Great East Rd, Lusaka, Zambia',
        description: 'Time to grab some amazing waffles and milkshakes!',
        start: {
          dateTime: tomorrow.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (res.ok) {
        setCalendarStatus('success');
        setTimeout(() => setCalendarStatus('idle'), 3000);
      } else {
        console.error('Failed to add calendar event:', await res.text());
        setCalendarStatus('idle');
      }
    } catch (err) {
      console.error(err);
      setCalendarStatus('idle');
    }
  };

  if (!user || !token) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center py-10">
        <h4 className="text-2xl font-bold font-display text-chocolate">Interactive Features</h4>
        <p className="text-xs text-chocolate/60 max-w-sm">
          Connect your Google Workspace to unlock exclusive features like direct email inquiries and seamless calendar booking.
        </p>
        <GoogleSignInBtn user={user} setUser={setUser} setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h4 className="text-2xl font-bold font-display text-chocolate">Workspace Connected</h4>
        <p className="text-xs text-chocolate/60">Manage your inquiries and visits directly from your Google account.</p>
      </div>

      <div className="space-y-6">
        {/* Send Email Block */}
        <div className="bg-white/50 border border-cream p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-chocolate font-bold">
            <Mail className="w-5 h-5 text-strawberry" />
            Send Inquiry (via Gmail)
          </div>
          <textarea 
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What dessert or service can we assist you with?"
            className="w-full bg-cream/20 border border-cream rounded-xl py-3 px-4 outline-none focus:border-caramel/50 focus:bg-white text-sm transition-all resize-none"
          />
          <button 
            onClick={sendEmail}
            disabled={emailStatus !== 'idle' || !message.trim()}
            className="w-full bg-chocolate text-cream font-bold py-2.5 px-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-chocolate/90 transition-all"
          >
            {emailStatus === 'sending' ? 'Sending...' : emailStatus === 'success' ? <><CheckCircle className="w-4 h-4" /> Sent successfully!</> : 'Send using Gmail'}
          </button>
        </div>

        {/* Add to Calendar Block */}
        <div className="bg-white/50 border border-cream p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-chocolate font-bold">
            <Calendar className="w-5 h-5 text-caramel" />
            Plan a Visit
          </div>
          <p className="text-xs text-chocolate/60">Automatically add a reminder to your primary Google Calendar to visit Delights tomorrow at 2:00 PM.</p>
          
          <button 
            onClick={addCalendarEvent}
            disabled={calendarStatus !== 'idle'}
            className="w-full bg-cream text-chocolate font-bold py-2.5 px-4 rounded-xl border border-chocolate/20 disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-cream/70 transition-all"
          >
            {calendarStatus === 'adding' ? 'Adding to Calendar...' : calendarStatus === 'success' ? <><CheckCircle className="w-4 h-4" /> Event Added!</> : 'Add to Google Calendar'}
          </button>
        </div>
      </div>
    </div>
  );
}
